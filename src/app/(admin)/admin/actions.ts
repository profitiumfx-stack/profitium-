"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin" ? user : null;
}

// ---- DEPOSITS ----
export async function confirmDeposit(depositId: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const admin = createAdminClient();

  const { data: dep } = await admin
    .from("deposits")
    .select("*")
    .eq("id", depositId)
    .single();
  if (!dep) return { error: "Deposit not found" };
  if (dep.status !== "pending") return { error: "Already reviewed" };

  // credit the user via ledger
  const { error: txErr } = await admin.from("transactions").insert({
    user_id: dep.user_id,
    type: "deposit",
    amount: Number(dep.amount),
    reference: `Deposit ${dep.network}`,
  });
  if (txErr) return { error: txErr.message };

  await admin
    .from("deposits")
    .update({ status: "confirmed", reviewed_at: new Date().toISOString() })
    .eq("id", depositId);

  revalidatePath("/admin");
  return { success: true };
}

export async function rejectDeposit(depositId: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const admin = createAdminClient();
  await admin
    .from("deposits")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", depositId);
  revalidatePath("/admin");
  return { success: true };
}

// ---- WITHDRAWALS ----
export async function approveWithdrawal(withdrawalId: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const admin = createAdminClient();

  const { data: wd } = await admin
    .from("withdrawals")
    .select("*")
    .eq("id", withdrawalId)
    .single();
  if (!wd) return { error: "Withdrawal not found" };
  if (wd.status !== "pending") return { error: "Already reviewed" };

  // re-check balance at approval time
  const { data: balanceRow } = await admin
    .from("balances")
    .select("balance")
    .eq("user_id", wd.user_id)
    .single();
  const balance = Number(balanceRow?.balance ?? 0);
  if (Number(wd.amount) > balance) {
    return { error: "User has insufficient balance" };
  }

  // debit via ledger
  const { error: txErr } = await admin.from("transactions").insert({
    user_id: wd.user_id,
    type: "withdrawal",
    amount: -Number(wd.amount),
    reference: `Withdrawal ${wd.network ?? ""}`.trim(),
  });
  if (txErr) return { error: txErr.message };

  await admin
    .from("withdrawals")
    .update({ status: "confirmed", reviewed_at: new Date().toISOString() })
    .eq("id", withdrawalId);

  revalidatePath("/admin");
  return { success: true };
}

export async function rejectWithdrawal(withdrawalId: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const admin = createAdminClient();
  await admin
    .from("withdrawals")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", withdrawalId);
  revalidatePath("/admin");
  return { success: true };
}

// ---- MANUAL BALANCE ADJUSTMENT ----
export async function adjustBalance(userId: string, amount: number, note: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  if (!amount) return { error: "Enter an amount" };
  const admin = createAdminClient();
  const { error } = await admin.from("transactions").insert({
    user_id: userId,
    type: amount >= 0 ? "deposit" : "withdrawal",
    amount,
    reference: note || "Manual adjustment",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function subscribeToPlan(planId: string, amount: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // fetch plan
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .eq("active", true)
    .single();
  if (!plan) return { error: "Plan not found" };

  // validate amount
  if (amount < Number(plan.min_amount)) {
    return { error: `Minimum is ${plan.min_amount}` };
  }
  if (plan.max_amount && amount > Number(plan.max_amount)) {
    return { error: `Maximum is ${plan.max_amount}` };
  }

  // check balance
  const { data: balanceRow } = await supabase
    .from("balances")
    .select("balance")
    .eq("user_id", user.id)
    .single();
  const balance = Number(balanceRow?.balance ?? 0);
  if (balance < amount) {
    return { error: "Insufficient balance. Please deposit first." };
  }

  // all writes via service role (ledger + investment)
  const admin = createAdminClient();
  const end = new Date();
  end.setDate(end.getDate() + plan.duration_days);

  const { data: investment, error: invErr } = await admin
    .from("investments")
    .insert({
      user_id: user.id,
      plan_id: planId,
      amount,
      status: "active",
      end_date: end.toISOString(),
    })
    .select()
    .single();
  if (invErr) return { error: invErr.message };

  // debit balance via ledger
  const { error: txErr } = await admin.from("transactions").insert({
    user_id: user.id,
    type: "investment",
    amount: -amount,
    reference: `Investment in ${plan.name}`,
  });
  if (txErr) return { error: txErr.message };

  revalidatePath("/dashboard");
  revalidatePath("/plans");
  return { success: true, investmentId: investment.id };
}
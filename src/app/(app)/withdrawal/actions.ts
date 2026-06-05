"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitWithdrawal(input: {
  amount: number;
  network: string;
  destination: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!input.amount || input.amount <= 0) {
    return { error: "Enter a valid amount" };
  }
  if (!input.network) {
    return { error: "Select a network" };
  }
  if (!input.destination || input.destination.trim().length < 10) {
    return { error: "Enter a valid destination address" };
  }

  // balance check
  const { data: balanceRow } = await supabase
    .from("balances")
    .select("balance")
    .eq("user_id", user.id)
    .single();
  const balance = Number(balanceRow?.balance ?? 0);
  if (input.amount > balance) {
    return { error: "Insufficient balance" };
  }

  // also block if there are pending withdrawals that would exceed balance
  const { data: pending } = await supabase
    .from("withdrawals")
    .select("amount")
    .eq("user_id", user.id)
    .eq("status", "pending");
  const pendingTotal = (pending ?? []).reduce((s, r) => s + Number(r.amount), 0);
  if (input.amount + pendingTotal > balance) {
    return { error: "Amount exceeds available balance (pending requests counted)" };
  }

  const { error } = await supabase.from("withdrawals").insert({
    user_id: user.id,
    amount: input.amount,
    network: input.network,
    destination: input.destination.trim(),
    status: "pending",
  });
  if (error) return { error: error.message };

  revalidatePath("/withdrawal");
  return { success: true };
}
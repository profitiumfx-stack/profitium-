"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitDeposit(input: {
  walletId: string;
  network: string;
  amount: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!input.amount || input.amount <= 0) {
    return { error: "Enter a valid amount" };
  }

  const { error } = await supabase.from("deposits").insert({
    user_id: user.id,
    wallet_id: input.walletId,
    network: input.network,
    amount: input.amount,
    status: "pending",
  });
  if (error) return { error: error.message };

  revalidatePath("/deposit");
  return { success: true };
}
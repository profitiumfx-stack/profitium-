import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import { AtmCardVisual } from "@/components/atm-card-visual";
import { FadeIn } from "@/components/ui/fade-in";

export default async function AtmCardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: balanceRow } = await supabase
    .from("balances")
    .select("balance")
    .eq("user_id", user!.id)
    .single();
  const balance = Number(balanceRow?.balance ?? 0);

  // Deterministic display number derived from user id — not a real card number
  const digits = (user!.id.replace(/\D/g, "") + "0000000000000000").slice(0, 16);
  const cardNumber = digits.match(/.{1,4}/g)?.join(" ") ?? "0000 0000 0000 0000";

  return (
    <div className="max-w-xl space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ATM Card</h1>
          <p className="mt-1 text-sm text-slate-500">Your virtual account card.</p>
        </div>
      </FadeIn>

      <AtmCardVisual
        name={profile?.full_name ?? "Account Holder"}
        balance={formatCurrency(balance)}
        cardNumber={cardNumber}
      />
    </div>
  );
}

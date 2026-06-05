import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { WithdrawalForm } from "@/components/withdrawal-form";

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
  pending:   "bg-amber-400/10 text-amber-700 ring-1 ring-amber-400/20",
  rejected:  "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20",
};

export default async function WithdrawalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: balanceRow } = await supabase
    .from("balances")
    .select("balance")
    .eq("user_id", user!.id)
    .single();
  const balance = Number(balanceRow?.balance ?? 0);

  const { data: walletRows } = await supabase
    .from("wallets")
    .select("network")
    .eq("active", true);
  const networks = Array.from(new Set((walletRows ?? []).map((w) => w.network)));

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("id, amount, network, status, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Withdrawal</h1>
          <p className="mt-1 text-sm text-slate-500">
            Request a payout to your crypto wallet.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-2">
        <FadeIn delay={0.08}>
          <WithdrawalForm balance={balance} networks={networks} />
        </FadeIn>

        <FadeIn delay={0.16}>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Withdrawal History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!withdrawals || withdrawals.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  No withdrawals yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(Number(w.amount))}
                        </p>
                        <p className="text-xs text-slate-400">
                          {w.network} · {formatDate(w.created_at)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                          statusStyles[w.status] ?? statusStyles.pending
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { DepositForm } from "@/components/deposit-form";

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
  pending:   "bg-amber-400/10 text-amber-700 ring-1 ring-amber-400/20",
  rejected:  "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20",
};

export default async function DepositPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: wallets } = await supabase
    .from("wallets")
    .select("id, network, label, address")
    .eq("active", true)
    .order("network");

  const { data: deposits } = await supabase
    .from("deposits")
    .select("id, network, amount, status, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deposit</h1>
          <p className="mt-1 text-sm text-slate-500">
            Fund your account by sending crypto to one of our addresses.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-2">
        <FadeIn delay={0.08}>
          <DepositForm wallets={wallets ?? []} />
        </FadeIn>

        <FadeIn delay={0.16}>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Deposit History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!deposits || deposits.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  No deposits yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {deposits.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(Number(d.amount))}
                        </p>
                        <p className="text-xs text-slate-400">
                          {d.network} · {formatDate(d.created_at)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                          statusStyles[d.status] ?? statusStyles.pending
                        }`}
                      >
                        {d.status}
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

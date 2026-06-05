import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActions } from "@/components/admin-actions";
import { Users, ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react";


export default async function AdminPage() {
  const admin = createAdminClient();

  const [{ data: pendingDeposits }, { data: pendingWithdrawals }, { count: userCount }] =
    await Promise.all([
      admin
        .from("deposits")
        .select("id, amount, network, tx_hash, created_at, profiles(full_name, email)")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      admin
        .from("withdrawals")
        .select("id, amount, network, destination, created_at, profiles(full_name, email)")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Total Users", value: userCount ?? 0, icon: Users, color: "bg-amber-400/10 text-amber-600" },
    { label: "Pending Deposits", value: pendingDeposits?.length ?? 0, icon: ArrowDownToLine, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Pending Withdrawals", value: pendingWithdrawals?.length ?? 0, icon: ArrowUpFromLine, color: "bg-rose-500/10 text-rose-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      {/* stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-slate-200 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* pending deposits */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" /> Pending Deposits
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {!pendingDeposits || pendingDeposits.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No pending deposits.</p>
          ) : (
            <div className="space-y-3">
              {pendingDeposits.map((d) => {
                const p = d.profiles as unknown as { full_name: string; email: string };
                return (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(Number(d.amount))}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {d.network}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {p?.full_name ?? "User"} · {p?.email}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-400">
                        tx: {d.tx_hash} · {formatDate(d.created_at)}
                      </p>
                    </div>
                    <AdminActions id={d.id} kind="deposit" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* pending withdrawals */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" /> Pending Withdrawals
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {!pendingWithdrawals || pendingWithdrawals.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No pending withdrawals.</p>
          ) : (
            <div className="space-y-3">
              {pendingWithdrawals.map((w) => {
                const p = w.profiles as unknown as { full_name: string; email: string };
                return (
                  <div
                    key={w.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(Number(w.amount))}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {w.network}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {p?.full_name ?? "User"} · {p?.email}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-400">
                        to: {w.destination} · {formatDate(w.created_at)}
                      </p>
                    </div>
                    <AdminActions id={w.id} kind="withdrawal" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger";
import { ActivityTicker, type ActivityEvent } from "@/components/activity-ticker";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  completed: "bg-slate-100 text-slate-600 ring-slate-200",
  cancelled: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

const txColors: Record<string, string> = {
  deposit: "bg-emerald-500/10 text-emerald-700",
  withdrawal: "bg-rose-500/10 text-rose-700",
  investment: "bg-slate-100 text-slate-600",
  daily_return: "bg-amber-400/10 text-amber-700",
  referral_bonus: "bg-blue-500/10 text-blue-700",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── personal data (all scoped to current user) ─────────────────────────

  const [
    { data: profile },
    { data: balanceRow },
    { data: investments },
    { data: depositSum },
    { data: investedSum },
    { data: transactions },
    // ── platform-wide activity (anonymised below) ─────────────────────────
    { data: recentRegistrations },
    { data: recentInvestments },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user!.id)
      .single(),

    supabase
      .from("balances")
      .select("balance")
      .eq("user_id", user!.id)
      .single(),

    supabase
      .from("investments")
      .select("id, amount, status, start_date, end_date, plans(name, roi_percent, duration_days)")
      .eq("user_id", user!.id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),

    supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user!.id)
      .eq("type", "deposit"),

    supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user!.id)
      .eq("type", "investment"),

    supabase
      .from("transactions")
      .select("id, type, amount, reference, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(8),

    // Only id + created_at — no names, emails, or any PII
    supabase
      .from("profiles")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(8),

    // Only id + created_at + plan name — no user identity or amounts
    supabase
      .from("investments")
      .select("id, created_at, plans(name)")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  // ── derived personal stats ──────────────────────────────────────────────

  const balance = Number(balanceRow?.balance ?? 0);
  const totalDeposits = (depositSum ?? []).reduce(
    (s, r) => s + Number(r.amount),
    0,
  );
  const totalInvested = Math.abs(
    (investedSum ?? []).reduce((s, r) => s + Number(r.amount), 0),
  );
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  // ── build anonymised activity feed ─────────────────────────────────────
  // No user names, emails, locations, or amounts ever enter these strings.

  type RawEvent = ActivityEvent & { ts: number };
  const rawEvents: RawEvent[] = [];

  for (const reg of recentRegistrations ?? []) {
    rawEvents.push({
      id: `reg-${reg.id}`,
      text: "A new member just joined",
      timeAgo: formatRelativeTime(reg.created_at),
      ts: new Date(reg.created_at).getTime(),
    });
  }

  for (const inv of recentInvestments ?? []) {
    const planName = (inv.plans as unknown as { name: string } | null)?.name;
    if (!planName) continue;
    rawEvents.push({
      id: `inv-${inv.id}`,
      text: `A member started the ${planName} plan`,
      timeAgo: formatRelativeTime(inv.created_at),
      ts: new Date(inv.created_at).getTime(),
    });
  }

  rawEvents.sort((a, b) => b.ts - a.ts);

  // Strip the internal sort key before passing to the client component
  const activityEvents: ActivityEvent[] = rawEvents
    .slice(0, 10)
    .map(({ ts: _ts, ...event }) => event);

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* greeting */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Here&apos;s an overview of your account.
          </p>
        </div>
      </FadeIn>

      {/* live activity ticker — renders nothing when empty */}
      {activityEvents.length > 0 && (
        <FadeIn delay={0.05}>
          <ActivityTicker events={activityEvents} />
        </FadeIn>
      )}

      {/* balance hero */}
      <FadeIn delay={0.1}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
          />
          {/* brand mark — top-right corner, credit-card style */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-5 top-5 select-none"
          >
            <Image src="/logo.png" alt="" width={124} height={124} draggable={false} className="rounded-2xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Wallet className="h-4 w-4" />
              Total Balance
            </div>
            <p className="mt-2 text-4xl font-bold tracking-tight">
              {formatCurrency(balance)}
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/deposit"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-slate-900 transition-all hover:bg-amber-300"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Deposit
              </Link>
              <Link
                href="/withdrawal"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                <ArrowUpFromLine className="h-4 w-4" />
                Withdraw
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* secondary stats */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2">
        <StaggerItem>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <ArrowDownToLine className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Deposits</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(totalDeposits)}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Invested</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* two-column: investments + transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* active investments */}
        <FadeIn delay={0.15}>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Active Investments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!investments || investments.length === 0 ? (
                <div className="py-10 text-center">
                  <TrendingUp className="mx-auto h-8 w-8 text-slate-200" />
                  <p className="mt-2 text-sm text-slate-400">
                    No active investments.
                  </p>
                  <Link
                    href="/plans"
                    className="mt-3 inline-flex text-sm font-medium text-amber-600 hover:text-amber-500"
                  >
                    Browse plans →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.map((inv) => {
                    const plan = inv.plans as unknown as {
                      name: string;
                      roi_percent: number;
                      duration_days: number;
                    };
                    const start = inv.start_date
                      ? new Date(inv.start_date).getTime()
                      : Date.now();
                    const end = inv.end_date
                      ? new Date(inv.end_date).getTime()
                      : start;
                    const total = end - start || 1;
                    const elapsed = Math.min(Date.now() - start, total);
                    const pct = Math.round((elapsed / total) * 100);
                    return (
                      <div
                        key={inv.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {plan?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatCurrency(Number(inv.amount))} ·{" "}
                              {plan?.roi_percent}% daily
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ring-inset ${
                              statusColors[inv.status] ?? statusColors.completed
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        {inv.end_date && (
                          <div className="mt-3">
                            <div className="mb-1 flex justify-between text-[10px] text-slate-400">
                              <span>Progress</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-200">
                              <div
                                className="h-1.5 rounded-full bg-amber-400 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="mt-1 text-[10px] text-slate-400">
                              Ends {formatDate(inv.end_date)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* recent transactions */}
        <FadeIn delay={0.22}>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!transactions || transactions.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  No transactions yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {transactions.map((t) => {
                    const credit = Number(t.amount) >= 0;
                    const colorClass =
                      txColors[t.type] ?? "bg-slate-100 text-slate-600";
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorClass}`}
                          >
                            {credit ? (
                              <ArrowDownToLine className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpFromLine className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium capitalize text-slate-800">
                              {t.type.replace(/_/g, " ")}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {formatDate(t.created_at)}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`text-sm font-semibold ${
                            credit ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {credit ? "+" : "−"}
                          {formatCurrency(Math.abs(Number(t.amount)))}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

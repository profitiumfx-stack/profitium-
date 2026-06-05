import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger";
import { ReferralLink } from "@/components/referral-link";
import { Users, DollarSign } from "lucide-react";

export default async function ReferralsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user!.id)
    .single();

  const { data: referred } = await supabase
    .from("profiles")
    .select("full_name, created_at")
    .eq("referred_by", user!.id)
    .order("created_at", { ascending: false });

  const { data: bonuses } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", user!.id)
    .eq("type", "referral_bonus");
  const totalBonus = (bonuses ?? []).reduce((s, r) => s + Number(r.amount), 0);

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Referrals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Invite others and earn rewards.
          </p>
        </div>
      </FadeIn>

      {/* stats */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2">
        <StaggerItem>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Referrals</p>
                <p className="text-xl font-bold text-slate-900">
                  {referred?.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Referral Earnings</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(totalBonus)}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* referral link */}
      <FadeIn delay={0.1}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <ReferralLink code={profile?.referral_code ?? ""} />
            <p className="text-xs text-slate-500">
              Your code:{" "}
              <span className="font-mono font-semibold text-slate-700">
                {profile?.referral_code}
              </span>
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* referred users */}
      <FadeIn delay={0.18}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Referred Users
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {!referred || referred.length === 0 ? (
              <div className="py-10 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-200" />
                <p className="mt-2 text-sm text-slate-400">
                  No referrals yet. Share your link to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {referred.map((r, i) => {
                  const initials = (r.full_name ?? "?")
                    .split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-xs font-semibold text-amber-600">
                          {initials}
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          {r.full_name ?? "New user"}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400">
                        {formatDate(r.created_at)}
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
  );
}

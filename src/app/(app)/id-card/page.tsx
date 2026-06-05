import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { FadeIn } from "@/components/ui/fade-in";
import Image from "next/image";

export default async function IdCardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, created_at, referral_code, avatar_url")
    .eq("id", user!.id)
    .single();

  const memberId = user!.id.slice(0, 8).toUpperCase();
  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "PX";

  return (
    <div className="max-w-xl space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ID Card</h1>
          <p className="mt-1 text-sm text-slate-500">Your membership identity card.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* header */}
          <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Profitium FX"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <div>
                <p className="text-sm font-bold tracking-wide text-white">
                  PROFITIUM <span className="text-amber-400">FX</span>
                </p>
                <p className="text-[10px] tracking-widest text-slate-400">
                  MEMBER IDENTITY CARD
                </p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
              Premium Member
            </span>
          </div>

          {/* body */}
          <div className="flex gap-5 p-6">
            {/* avatar: photo if set, otherwise initials */}
            {profile?.avatar_url ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name ?? "Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-2xl font-bold text-amber-400 shadow-sm">
                {initials}
              </div>
            )}

            <div className="flex-1 space-y-3 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Full Name
                </p>
                <p className="mt-0.5 font-semibold text-slate-900">
                  {profile?.full_name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Member ID
                </p>
                <p className="mt-0.5 font-mono font-semibold text-slate-900">
                  {memberId}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Member Since
                </p>
                <p className="mt-0.5 font-semibold text-slate-900">
                  {profile?.created_at ? formatDate(profile.created_at) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3">
            <p className="text-xs text-slate-400">{profile?.email}</p>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

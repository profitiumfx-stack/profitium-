import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { ProfileForm } from "@/components/profile-form";
import { AvatarUpload } from "@/components/avatar-upload";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, created_at, referral_code, avatar_url")
    .eq("id", user!.id)
    .single();

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="max-w-2xl space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account details.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* avatar + meta */}
            <div className="flex items-center gap-5">
              <AvatarUpload
                userId={user!.id}
                avatarUrl={profile?.avatar_url ?? null}
                initials={initials}
              />
              <div>
                <p className="font-semibold text-slate-900">
                  {profile?.full_name ?? "—"}
                </p>
                <p className="text-sm text-slate-500">{profile?.email}</p>
              </div>
            </div>

            {/* info grid */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Email
                </p>
                <p className="mt-1 font-medium text-slate-900">{profile?.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Member Since
                </p>
                <p className="mt-1 font-medium text-slate-900">
                  {profile?.created_at ? formatDate(profile.created_at) : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Referral Code
                </p>
                <p className="mt-1 font-mono font-medium text-slate-900">
                  {profile?.referral_code ?? "—"}
                </p>
              </div>
            </div>

            {/* edit form */}
            <div className="border-t border-slate-100 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Edit Details
              </p>
              <ProfileForm
                initialName={profile?.full_name ?? ""}
                initialPhone={profile?.phone ?? ""}
              />
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

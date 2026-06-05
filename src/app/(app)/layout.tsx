import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { CryptoTicker } from "@/components/crypto-ticker";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  const userName = profile?.full_name ?? "";
  const userEmail = profile?.email ?? user.email ?? "";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100/60">
      <aside className="hidden w-64 shrink-0 lg:block">
        <Sidebar userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />
        <CryptoTicker variant="light" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

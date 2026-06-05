import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default async function AdminLayout({
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
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-100/60">
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Profitium FX" width={28} height={28} className="rounded-lg" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Profitium FX</span>
            <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
              <ShieldCheck className="h-3 w-3" />
              Admin
            </span>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </Link>
      </header>
      <main className="p-6 lg:p-8">{children}</main>
    </div>
  );
}

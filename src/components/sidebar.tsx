"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, User, TrendingUp, Users, Landmark,
  ArrowDownUp, CreditCard, IdCard, Settings, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: null,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/profile", label: "Profile", icon: User },
    ],
  },
  {
    title: "Apps",
    items: [
      { href: "/plans", label: "Investment Plans", icon: TrendingUp },
      { href: "/referrals", label: "Referrals", icon: Users },
    ],
  },
  {
    title: "Transactions",
    items: [
      { href: "/deposit", label: "Deposit", icon: Landmark },
      { href: "/withdrawal", label: "Withdrawal", icon: ArrowDownUp },
    ],
  },
  {
    title: "Cards",
    items: [
      { href: "/atm-card", label: "ATM Card", icon: CreditCard },
      { href: "/id-card", label: "ID Card", icon: IdCard },
    ],
  },
  {
    title: "Extras",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export function Sidebar({
  onNavigate,
  userName,
  userEmail,
  avatarUrl,
}: {
  onNavigate?: () => void;
  userName: string;
  userEmail: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const initials =
    userName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-5">
        <div className="relative">
          <Image
            src="/logo.png"
            alt="Profitium FX"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="absolute -inset-0.5 rounded-lg ring-1 ring-amber-400/30" />
        </div>
        <span className="whitespace-nowrap text-base font-semibold tracking-tight">
          Profitium <span className="text-amber-400">FX</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-amber-400"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute inset-0 rounded-lg bg-amber-400/10"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4 shrink-0" />
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="space-y-1 border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          {/* avatar */}
          {avatarUrl ? (
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <Image src={avatarUrl} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-xs font-semibold text-amber-400">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-200">
              {userName || "Account"}
            </p>
            <p className="truncate text-[10px] text-slate-500">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log Out
        </button>
      </div>
    </div>
  );
}

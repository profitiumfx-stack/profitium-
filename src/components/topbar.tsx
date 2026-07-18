"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/plans": "Investment Plans",
  "/referrals": "Referrals",
  "/deposit": "Deposit",
  "/withdrawal": "Withdrawal",
  "/atm-card": "ATM Card",
  "/id-card": "ID Card",
  "/settings": "Settings",
};

export function Topbar({
  userName,
  userEmail,
  avatarUrl,
}: {
  userName: string;
  userEmail: string;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? "Profitium FX";

  const initials =
    userName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
        {/* left: hamburger (mobile) + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-slate-800">{pageTitle}</span>
        </div>

        {/* right: language switcher + user avatar */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {avatarUrl ? (
            <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-amber-400/20">
              <Image src={avatarUrl} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-xs font-semibold text-amber-600">
              {initials}
            </div>
          )}
        </div>
      </header>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64">
            <div className="relative h-full">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 z-10 rounded-md p-1 text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar
                onNavigate={() => setOpen(false)}
                userName={userName}
                userEmail={userEmail}
                avatarUrl={avatarUrl}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
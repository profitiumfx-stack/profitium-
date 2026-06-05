"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAMES = [
  "James O.", "Sarah M.", "Michael T.", "Emma L.", "David K.",
  "Aisha B.", "Carlos R.", "Priya N.", "Liam W.", "Fatima A.",
  "Noah C.", "Olivia H.", "Ethan J.", "Sophia P.", "Lucas F.",
  "Amara S.", "Kai D.", "Yuki T.", "Andre V.", "Isabella G.",
  "Daniel F.", "Chloe R.", "Samuel A.", "Mia W.", "Omar H.",
  "Zara M.", "Ryan K.", "Leila S.", "Chris N.", "Nadia B.",
];

const COUNTRIES = [
  { name: "USA",            flag: "🇺🇸" },
  { name: "Germany",        flag: "🇩🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Canada",         flag: "🇨🇦" },
  { name: "Australia",      flag: "🇦🇺" },
  { name: "France",         flag: "🇫🇷" },
  { name: "Nigeria",        flag: "🇳🇬" },
  { name: "UAE",            flag: "🇦🇪" },
  { name: "South Africa",   flag: "🇿🇦" },
  { name: "Brazil",         flag: "🇧🇷" },
  { name: "Japan",          flag: "🇯🇵" },
  { name: "India",          flag: "🇮🇳" },
  { name: "Singapore",      flag: "🇸🇬" },
  { name: "Netherlands",    flag: "🇳🇱" },
  { name: "Ghana",          flag: "🇬🇭" },
  { name: "Mexico",         flag: "🇲🇽" },
  { name: "Sweden",         flag: "🇸🇪" },
  { name: "Kenya",          flag: "🇰🇪" },
  { name: "Italy",          flag: "🇮🇹" },
  { name: "Philippines",    flag: "🇵🇭" },
  { name: "Spain",          flag: "🇪🇸" },
  { name: "Pakistan",       flag: "🇵🇰" },
  { name: "Malaysia",       flag: "🇲🇾" },
  { name: "Poland",         flag: "🇵🇱" },
  { name: "Argentina",      flag: "🇦🇷" },
  { name: "Turkey",         flag: "🇹🇷" },
  { name: "Egypt",          flag: "🇪🇬" },
  { name: "Switzerland",    flag: "🇨🇭" },
  { name: "New Zealand",    flag: "🇳🇿" },
  { name: "Portugal",       flag: "🇵🇹" },
];

const AMOUNTS = [
  300, 500, 750, 1000, 1200, 1500, 2000, 2500, 3000,
  4000, 5000, 600, 800, 1800, 10000, 250, 350, 2200,
];

type Action = "deposited" | "withdrew";

type Toast = {
  key: number;
  name: string;
  country: string;
  flag: string;
  action: Action;
  amount: number;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fmtAmount(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function LiveNotification() {
  const [toast, setToast] = useState<Toast | null>(null);
  const keyRef = useRef(0);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function show() {
      if (dismissRef.current) clearTimeout(dismissRef.current);

      const country = pick(COUNTRIES);
      const action: Action = Math.random() > 0.38 ? "deposited" : "withdrew";

      setToast({
        key: ++keyRef.current,
        name: pick(NAMES),
        country: country.name,
        flag: country.flag,
        action,
        amount: pick(AMOUNTS),
      });

      dismissRef.current = setTimeout(() => setToast(null), 5500);
    }

    const first = setTimeout(show, 4000);
    const loop = setInterval(show, 10_000);

    return () => {
      clearTimeout(first);
      clearInterval(loop);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.35, ease }}
            className="flex w-[272px] items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-2xl shadow-slate-900/15"
          >
            {/* action icon */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                toast.action === "deposited"
                  ? "bg-emerald-500/10"
                  : "bg-rose-500/10"
              }`}
            >
              {toast.action === "deposited" ? (
                <ArrowDownToLine className="h-4 w-4 text-emerald-600" />
              ) : (
                <ArrowUpFromLine className="h-4 w-4 text-rose-600" />
              )}
            </div>

            {/* text */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-slate-800">
                {toast.name}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                <span className="mr-1 text-[13px]">{toast.flag}</span>
                {toast.country} · just {toast.action}{" "}
                <span
                  className={`font-semibold ${
                    toast.action === "deposited"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {fmtAmount(toast.amount)}
                </span>
              </p>
            </div>

            {/* live pulse dot */}
            <span className="relative ml-1 flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

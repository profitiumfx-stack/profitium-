"use client";

import { useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { toast } from "sonner";

export function ReferralLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${code}`
      : `/register?ref=${code}`;

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="flex-1 truncate font-mono text-xs text-slate-600">
        {link}
      </span>
      <button
        onClick={copy}
        className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Copy referral link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

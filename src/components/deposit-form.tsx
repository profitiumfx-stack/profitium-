"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { submitDeposit } from "@/app/(app)/deposit/actions";

type Wallet = {
  id: string;
  network: string;
  label: string | null;
  address: string;
};

export function DepositForm({ wallets }: { wallets: Wallet[] }) {
  const router = useRouter();
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const selected = wallets.find((w) => w.id === walletId);

  function copyAddress() {
    if (!selected) return;
    navigator.clipboard.writeText(selected.address);
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit() {
    if (!selected) {
      toast.error("Select a network first");
      return;
    }
    setLoading(true);
    const res = await submitDeposit({
      walletId: selected.id,
      network: selected.network,
      amount: Number(amount),
    });
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Deposit submitted for review");
    setAmount("");
    router.refresh();
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Make a Deposit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {/* step 1: select network */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            1 · Select Network
          </Label>
          <Select value={walletId} onValueChange={(v) => setWalletId(v ?? "")}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose a network" />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.label ?? w.network}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* step 2: address */}
        {selected && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              2 · Send to this address
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <code className="flex-1 break-all text-xs leading-relaxed text-slate-700">
                {selected.address}
              </code>
              <button
                onClick={copyAddress}
                className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                aria-label="Copy address"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200/60 p-2.5 text-xs text-amber-700">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Send only {selected.label ?? selected.network} to this address. Wrong-asset sends may result in permanent loss.
            </div>
          </div>
        )}

        {/* step 3: amount */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            3 · Amount Sent (USD)
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-11"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="h-11 w-full font-semibold">
          {loading ? "Submitting…" : "Submit Deposit"}
        </Button>
      </CardContent>
    </Card>
  );
}
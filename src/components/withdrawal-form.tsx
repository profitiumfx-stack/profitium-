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
import { formatCurrency } from "@/lib/format";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { submitWithdrawal } from "@/app/(app)/withdrawal/actions";

export function WithdrawalForm({
  balance,
  networks,
}: {
  balance: number;
  networks: string[];
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const res = await submitWithdrawal({
      amount: Number(amount),
      network,
      destination,
    });
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Withdrawal request submitted");
    setAmount("");
    setDestination("");
    setNetwork("");
    router.refresh();
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Request Withdrawal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {/* available balance */}
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/8 p-4">
          <p className="text-xs text-amber-700/70">Available Balance</p>
          <p className="mt-0.5 text-2xl font-bold text-slate-900">
            {formatCurrency(balance)}
          </p>
        </div>

        {/* amount */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Amount (USD)
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-11"
          />
          <button
            type="button"
            onClick={() => setAmount(String(balance))}
            className="text-xs font-medium text-amber-600 hover:text-amber-500"
          >
            Withdraw max
          </button>
        </div>

        {/* network */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Network
          </Label>
          <Select value={network} onValueChange={(v) => setNetwork(v ?? "")}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose a network" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* destination */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Destination Address
          </Label>
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Your wallet address"
            className="h-11 font-mono text-xs"
          />
          <div className="flex items-start gap-1.5 rounded-lg bg-rose-50 border border-rose-200/60 p-2.5 text-xs text-rose-700">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Double-check this address. Withdrawals to a wrong address cannot be reversed.
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-11 w-full font-semibold"
        >
          {loading ? "Submitting…" : "Request Withdrawal"}
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { subscribeToPlan } from "@/app/(app)/plans/actions";
import { TrendingUp, Clock } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number | null;
  roi_percent: number;
  duration_days: number;
};

export function SubscribeDialog({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setLoading(true);
    const res = await subscribeToPlan(plan.id, value);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(`Subscribed to ${plan.name}`);
    setOpen(false);
    setAmount("");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full font-semibold" />}>
        Invest Now
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Invest in {plan.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* plan summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/8 border border-amber-400/15 p-3">
              <TrendingUp className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500">Daily return</p>
                <p className="text-sm font-semibold text-slate-900">{plan.roi_percent}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3">
              <Clock className="h-4 w-4 text-slate-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500">Duration</p>
                <p className="text-sm font-semibold text-slate-900">{plan.duration_days} days</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Min ₦${plan.min_amount.toLocaleString()}`}
              className="h-11"
            />
            {plan.max_amount && (
              <p className="text-xs text-slate-400">
                Max {plan.max_amount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubscribe} disabled={loading} className="w-full font-semibold">
            {loading ? "Processing…" : "Confirm Investment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

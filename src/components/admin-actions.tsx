"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  confirmDeposit, rejectDeposit, approveWithdrawal, rejectWithdrawal,
} from "@/app/(admin)/admin/actions";

type Kind = "deposit" | "withdrawal";

export function AdminActions({ id, kind }: { id: string; kind: Kind }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function run(which: "approve" | "reject") {
    setLoading(which);
    let res;
    if (kind === "deposit") {
      res = which === "approve" ? await confirmDeposit(id) : await rejectDeposit(id);
    } else {
      res = which === "approve" ? await approveWithdrawal(id) : await rejectWithdrawal(id);
    }
    setLoading(null);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(which === "approve" ? "Approved" : "Rejected");
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => run("approve")}
        disabled={loading !== null}
        className="font-semibold"
      >
        {loading === "approve" ? "…" : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => run("reject")}
        disabled={loading !== null}
      >
        {loading === "reject" ? "…" : "Reject"}
      </Button>
    </div>
  );
}

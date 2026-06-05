"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfile } from "@/app/(app)/profile/actions";

export function ProfileForm({
  initialName,
  initialPhone,
}: {
  initialName: string;
  initialPhone: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const res = await updateProfile({ fullName, phone });
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Profile updated");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-slate-700">Full Name</Label>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-slate-700">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+234…"
          className="h-11"
        />
      </div>
      <Button onClick={handleSave} disabled={loading} className="font-semibold">
        {loading ? "Saving…" : "Save Changes"}
      </Button>
    </div>
  );
}

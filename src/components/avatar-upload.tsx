"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Camera } from "lucide-react";

export function AvatarUpload({
  userId,
  avatarUrl,
  initials,
}: {
  userId: string;
  avatarUrl: string | null;
  initials: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(avatarUrl);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // reset so the same file can be re-selected after an error
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB");
      return;
    }

    setUploading(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${userId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      toast.error(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    setUploading(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    setPreview(publicUrl);
    toast.success("Photo updated");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* avatar button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Upload profile photo"
        className="group relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 shadow-sm transition-opacity disabled:cursor-not-allowed"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile photo"
            fill
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-400">
            {initials}
          </span>
        )}

        {/* camera overlay on hover */}
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-0">
          <Camera className="h-5 w-5 text-white" />
        </span>
      </button>

      {/* text trigger */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs font-medium text-amber-600 hover:text-amber-500 disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload Photo"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

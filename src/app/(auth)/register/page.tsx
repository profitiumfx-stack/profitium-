"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, TrendingUp, Shield, Users } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const bullets = [
  { icon: TrendingUp, text: "Daily returns automatically credited" },
  { icon: Shield, text: "Secure admin-verified transactions" },
  { icon: Users, text: "Earn bonuses by referring friends" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setRefCode(ref);
  }, [searchParams]);

  async function handleRegister() {
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (refCode && data.user) {
      const { data: referrer } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", refCode)
        .single();
      if (referrer) {
        await supabase
          .from("profiles")
          .update({ referred_by: referrer.id })
          .eq("id", data.user.id);
      }
    }

    setLoading(false);
    toast.success("Account created — welcome!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease }}
      className="w-full max-w-sm"
    >
      <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Start growing your wealth today</p>

      <div className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-slate-700">Full name</Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="h-11 border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-slate-700">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="h-11 border-slate-200 pr-10 focus:border-amber-400 focus:ring-amber-400/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ref" className="text-slate-700">
            Referral code{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="ref"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
            placeholder="Enter code"
            className="h-11 border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
          />
        </div>

        <Button
          className="h-11 w-full text-sm font-semibold"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Account"}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-amber-600 hover:text-amber-500">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden w-2/5 shrink-0 flex-col justify-between bg-slate-900 p-10 lg:flex">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Profitium FX" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-semibold text-white">
            Profitium <span className="text-amber-400">FX</span>
          </span>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-snug text-white">
            Start earning<br />
            <span className="text-amber-400">from day one.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {bullets.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.text} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {b.text}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Profitium FX
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        {/* mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Image src="/logo.png" alt="Profitium FX" width={40} height={40} className="rounded-xl" />
          <span className="text-xl font-bold text-slate-900">
            Profitium <span className="text-amber-500">FX</span>
          </span>
        </div>

        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

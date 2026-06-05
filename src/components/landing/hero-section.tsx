"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">

      {/* ── Layer 1 · background image ──────────────────────────────────── */}
      <Image
        src="/heros.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />

      {/* ── Layer 2 · dark gradient overlay ─────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/85"
      />

      {/* ── Layer 3 · dot grid ───────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #475569 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Layer 4 · hero content ───────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl">
        {/* logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/logo.png"
            alt="Profitium FX"
            width={72}
            height={72}
            className="rounded-2xl shadow-xl shadow-amber-400/20"
            priority
          />
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.65, ease }}
          className="mt-5 text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          Grow Your Crypto,{" "}
          <span className="text-amber-400">Daily</span>
        </motion.h1>

        {/* sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300"
        >
          Earn consistent daily returns on your crypto investment.
          Choose your plan, sit back, and watch your balance grow —
          with withdrawals available whenever you need them.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.6, ease }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/register"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-amber-400 px-8 text-base font-semibold text-slate-900 transition-all hover:bg-amber-300 hover:shadow-[0_0_28px_rgba(251,191,36,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Start Investing
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-700 px-8 text-base font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Sign In
          </Link>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex h-6 w-4 items-start justify-center rounded-full border border-slate-600 pt-1.5"
        >
          <div className="h-1.5 w-0.5 rounded-full bg-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

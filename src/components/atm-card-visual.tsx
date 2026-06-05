"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { RotateCcw } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function AtmCardVisual({
  name,
  balance,
  cardNumber,
}: {
  name: string;
  balance: string;
  cardNumber: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Tilt springs — only active on the front face
  const tiltX = useSpring(0, { stiffness: 300, damping: 30 });
  const tiltY = useSpring(0, { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (flipped) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-ny * 18);
    tiltY.set(nx * 18);
  }

  function handleMouseLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  function handleFlip() {
    // reset tilt before flipping so the card snaps level
    tiltX.set(0);
    tiltY.set(0);
    setFlipped((f) => !f);
  }

  return (
    <div className="space-y-3">
      {/*
        Layer 1 — entrance animation + perspective context.
        `perspective` must sit on the *parent* of the element
        being 3-D transformed (MDN spec).
      */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        style={{ perspective: "1200px" }}
      >
        {/*
          Layer 2 — flip wrapper.
          Owns the Y-rotation that flips front ↔ back.
          `transformStyle: preserve-3d` makes both child faces
          participate in the same 3-D space so backface-visibility works.
        */}
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[1.586/1] w-full"
        >

          {/* ── FRONT FACE ─────────────────────────────────────────── */}
          {/*
            Layer 3 — tilt wrapper (mouse interaction).
            backfaceVisibility: hidden hides this face once the flip
            wrapper has rotated past 90°.
            Note: overflow-hidden clips the shimmer; it does NOT break
            the parent's preserve-3d because it is a *child*, not an
            ancestor, of the preserve-3d element.
          */}
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleFlip}
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              backfaceVisibility: "hidden",
            }}
            className="absolute inset-0 cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white shadow-2xl shadow-slate-900/50 select-none"
          >
            {/* dot grid texture */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* ambient gold glow */}
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
            />
            {/* shimmer sweep on mount */}
            <motion.div
              aria-hidden
              initial={{ x: "-150%", opacity: 0 }}
              animate={{ x: "300%", opacity: [0, 0.35, 0.35, 0] }}
              transition={{ delay: 0.7, duration: 1.4, ease: "easeInOut" }}
              className="pointer-events-none absolute top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            {/* header row */}
            <div className="relative flex items-start justify-between">
              <span className="text-sm font-semibold tracking-wide">
                Profitium <span className="text-amber-400">FX</span>
              </span>
              <div className="h-8 w-12 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30" />
            </div>

            {/* balance */}
            <div className="relative mt-8">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">
                Available Balance
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{balance}</p>
            </div>

            {/* card number */}
            <div className="relative mt-5 font-mono text-base tracking-widest text-slate-300">
              {cardNumber}
            </div>

            {/* footer row */}
            <div className="relative mt-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Card Holder
                </p>
                <p className="mt-0.5 text-sm font-semibold uppercase tracking-wide">
                  {name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Valid
                </p>
                <p className="mt-0.5 text-sm font-medium">∞</p>
              </div>
            </div>
          </motion.div>

          {/* ── BACK FACE ──────────────────────────────────────────── */}
          {/*
            rotateY(180deg) pre-rotates this face so it starts facing
            away. When the flip wrapper reaches 180° it faces forward.
            backfaceVisibility: hidden keeps it invisible while front-
            facing (< 90° flip progress).
            Plain div — no extra Framer Motion transforms needed.
          */}
          <div
            onClick={handleFlip}
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
            className="absolute inset-0 flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-2xl shadow-slate-900/50 select-none"
          >
            {/* dot grid texture */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* ambient gold glow — mirrored to left (face is rotated 180°) */}
            <div
              aria-hidden
              className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
            />

            {/* magnetic stripe — full-bleed, no padding */}
            <div
              aria-hidden
              className="relative h-11 w-full shrink-0 bg-black/80"
            />

            {/* back content */}
            <div className="relative flex flex-1 flex-col justify-between px-6 pb-5 pt-4">

              {/* signature strip + CVV */}
              <div className="flex items-center gap-3">
                {/* signature strip */}
                <div className="flex-1 overflow-hidden rounded bg-gradient-to-r from-slate-200 to-white px-3 py-2 shadow-inner">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">
                    Authorized Signature
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs italic text-slate-700">
                    {name.toUpperCase()}
                  </p>
                </div>

                {/* CVV — decorative ••• only, never a real value */}
                <div className="shrink-0 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">
                    CVV
                  </p>
                  <div className="mt-1 rounded border border-slate-600 bg-slate-800 px-3 py-1.5">
                    <p className="font-mono text-sm tracking-widest text-slate-200">
                      •••
                    </p>
                  </div>
                </div>
              </div>

              {/* wordmark */}
              <p className="text-sm font-semibold tracking-tight">
                Profitium <span className="text-amber-400">FX</span>
              </p>

              {/* fine-print disclaimer */}
              <p className="text-[10px] leading-relaxed text-slate-500">
                This is a virtual card representing your account balance. It is
                not a physical payment card and cannot be used for purchases.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* flip button */}
      <button
        type="button"
        onClick={handleFlip}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-amber-500"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {flipped ? "Show front" : "Flip card"}
      </button>
    </div>
  );
}

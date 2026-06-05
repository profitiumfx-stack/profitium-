"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type ActivityEvent = {
  id: string;
  text: string;
  timeAgo: string;
};

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function ActivityTicker({ events }: { events: ActivityEvent[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % events.length),
      5000,
    );
    return () => clearInterval(id);
  }, [events.length]);

  // empty state → render nothing, as specified
  if (events.length === 0) return null;

  const current = events[index];

  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {/* live pulse dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
      </span>

      {/* sliding event text */}
      <div className="min-w-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.25, ease }}
            className="flex min-w-0 items-baseline gap-2"
          >
            <span className="truncate text-sm text-slate-700">
              {current.text}
            </span>
            <span className="shrink-0 text-[11px] tabular-nums text-slate-400">
              {current.timeAgo}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dot progress — shown only when ≤ 7 events (more would be cramped) */}
      {events.length > 1 && events.length <= 7 && (
        <div className="flex shrink-0 items-center gap-1">
          {events.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-3 bg-amber-400" : "w-1 bg-slate-200"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

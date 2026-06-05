"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

const COINS = [
  { id: "bitcoin",       symbol: "BTC"  },
  { id: "ethereum",      symbol: "ETH"  },
  { id: "tether",        symbol: "USDT" },
  { id: "binancecoin",   symbol: "BNB"  },
  { id: "tron",          symbol: "TRX"  },
  { id: "matic-network", symbol: "MATIC"},
] as const;

type CoinId = (typeof COINS)[number]["id"];

// CoinGecko may omit any field — everything is optional at the wire level
type RawEntry = { usd?: unknown; usd_24h_change?: unknown };
type RawPrices = Partial<Record<CoinId, RawEntry>>;

// What we actually render — both fields are verified finite numbers
type TickerEntry = { id: CoinId; symbol: string; usd: number; change: number };

const IDS = COINS.map((c) => c.id).join(",");
const API =
  `https://api.coingecko.com/api/v3/simple/price` +
  `?ids=${IDS}&vs_currencies=usd&include_24hr_change=true`;

function isNum(v: unknown): v is number {
  return typeof v === "number" && isFinite(v);
}

function fmt(price: number): string {
  const dec = price >= 100 ? 0 : price >= 1 ? 2 : 4;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(price);
}

export function CryptoTicker({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [prices, setPrices] = useState<RawPrices>({});
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const raw: unknown = await res.json();
        if (raw && typeof raw === "object" && !Array.isArray(raw)) {
          if (!cancelled) setPrices((prev) => ({ ...prev, ...(raw as RawPrices) }));
        }
      } catch {
        // keep previous prices on network error
      }
    }

    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Only include coins where BOTH fields are valid finite numbers
  const entries: TickerEntry[] = COINS.flatMap((coin) => {
    const d = prices[coin.id];
    if (!d) return [];
    const usd = d.usd;
    const change = d.usd_24h_change;
    if (!isNum(usd) || !isNum(change)) return [];
    return [{ id: coin.id, symbol: coin.symbol, usd, change }];
  });

  if (entries.length === 0) return null;

  const isDark = variant === "dark";

  const wrapperCls = isDark
    ? "relative flex h-10 items-center overflow-hidden border-b border-slate-800/60 bg-slate-950"
    : "relative flex h-10 items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm";

  const fadeCls = isDark ? "from-slate-950" : "from-white";
  const symbolCls = isDark ? "text-slate-200" : "text-slate-800";
  const priceCls  = isDark ? "text-slate-400" : "text-slate-600";
  const dotCls    = isDark ? "text-slate-700" : "text-slate-300";

  return (
    <>
      <style>{`
        @keyframes crypto-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div
        aria-label="Live cryptocurrency prices"
        className={wrapperCls}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* left edge fade */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r ${fadeCls} to-transparent`}
        />
        {/* right edge fade */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l ${fadeCls} to-transparent`}
        />

        {/* scrolling track — two copies for seamless -50% loop */}
        <div
          className="flex shrink-0 items-center"
          style={{
            animation: "crypto-ticker 35s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {(["a", "b"] as const).flatMap((prefix) =>
            entries.map((coin) => {
              const positive = coin.change >= 0;
              return (
                <div
                  key={`${prefix}-${coin.id}`}
                  className="flex shrink-0 items-center gap-2 px-5"
                >
                  <span className={`text-[11px] font-bold tracking-wide ${symbolCls}`}>
                    {coin.symbol}
                  </span>
                  <span className={`text-[11px] tabular-nums ${priceCls}`}>
                    {fmt(coin.usd)}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-[10px] font-medium tabular-nums ${
                      positive ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {positive ? "+" : ""}
                    {coin.change.toFixed(2)}%
                  </span>
                  <span aria-hidden className={`select-none text-[11px] ${dotCls}`}>
                    ·
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

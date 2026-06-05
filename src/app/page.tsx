import { CryptoTicker } from "@/components/crypto-ticker";
import { HeroSection } from "@/components/landing/hero-section";
import { LiveNotification } from "@/components/live-notification";
import { FadeInView } from "@/components/ui/fade-in";
import { StaggerViewContainer, StaggerItem } from "@/components/ui/stagger";
import { Shield, TrendingUp, Globe, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Secure & Verified",
    description:
      "Every deposit is admin-confirmed and every withdrawal is admin-approved. Your funds are always protected.",
  },
  {
    icon: TrendingUp,
    title: "Daily Returns",
    description:
      "Earn daily for 7 days straight. Returns are automatically credited to your balance every 24 hours.",
  },
  {
    icon: Globe,
    title: "7 Crypto Networks",
    description:
      "Deposit with BTC, ETH, USDT, and more. Withdraw to whichever network you prefer.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description:
      "Share your unique link and earn a bonus every time someone you refer makes their first investment.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds with just your email. No lengthy KYC required to get started.",
  },
  {
    step: "02",
    title: "Fund Your Balance",
    description:
      "Deposit crypto to your account using any of our 7 supported networks. Admin confirmation within hours.",
  },
  {
    step: "03",
    title: "Choose a Plan & Earn",
    description:
      "Select your investment tier and watch your balance grow daily for 7 days. Withdraw anytime.",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-slate-950 text-white">
      {/* Floating social-proof notification — fixed, appears every 10 s */}
      <LiveNotification />

      {/* Live crypto price ticker */}
      <CryptoTicker />

      {/* Hero */}
      <HeroSection />

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeInView className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to invest with confidence
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              A full-featured crypto investment platform built for clarity,
              security, and consistent returns.
            </p>
          </FadeInView>

          <StaggerViewContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={f.title}>
                  <div className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-6 transition-all hover:border-amber-400/30 hover:bg-slate-800">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400/20 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {f.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerViewContainer>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <FadeInView className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Three steps to daily returns
            </h2>
            <p className="mt-4 text-slate-400">
              Getting started takes less than five minutes.
            </p>
          </FadeInView>

          <StaggerViewContainer className="mt-14 space-y-8">
            {steps.map((s) => (
              <StaggerItem key={s.step}>
                <div className="flex gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <div className="shrink-0 text-4xl font-bold text-amber-400/30 select-none leading-none">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {s.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerViewContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 bg-slate-900 px-6 py-24">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start growing?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Create your free account and start earning daily returns on your
            investment today.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-amber-400 px-10 text-base font-semibold text-slate-900 transition-all hover:bg-amber-300 hover:shadow-[0_0_28px_rgba(251,191,36,0.4)]"
          >
            Create Free Account
          </Link>
        </FadeInView>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Profitium FX"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-white">
              Profitium <span className="text-amber-400">FX</span>
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-slate-300 transition-colors">
              Register
            </Link>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
              Dashboard
            </Link>
          </nav>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Profitium FX. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

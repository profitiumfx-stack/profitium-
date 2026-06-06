import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LiveNotification } from "@/components/live-notification";
import { TawkChat } from "@/components/tawk-chat";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Profitium FX – Crypto Investment Platform",
  description:
    "Earn consistent daily returns on your crypto. Choose a plan, grow your balance, and withdraw anytime. 7 networks supported.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
        <LiveNotification />
        <TawkChat />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "learn-rv — your Cognitum Seed becomes an expert, for you, while you sleep",
  description:
    "Point your Cognitum Seed at a YouTube channel before bed. It watches every video, distills every insight, and stores it the way your brain stores knowledge — as vectors. You wake up an expert.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none"
             style={{
               backgroundImage:
                 "linear-gradient(rgba(30,41,59,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.08) 1px, transparent 1px)",
               backgroundSize: "48px 48px",
             }} />
        {children}
      </body>
    </html>
  );
}

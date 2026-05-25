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

const SITE_URL = "https://cognitum-learn-site.vercel.app";
const TITLE = "Cognitum Learn — your Cognitum One Seed becomes an expert, for you, while you sleep";
const DESCRIPTION =
  "Point your Cognitum One Seed at a YouTube channel before bed. It watches every video, distills every insight, and stores it the way your brain stores knowledge — as vectors. You wake up an expert.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Cognitum Learn",
  authors: [{ name: "Stuart Kerr", url: "https://cognitum.one" }],
  keywords: [
    "Cognitum One Seed",
    "Cognitum One",
    "Cognitum Learn",
    "Cognitum Seed",
    "v0 Appliance",
    "self-learning AI",
    "video knowledge base",
    "RAG",
    "RuVector",
    "RVF",
    "edge AI",
    "on-device AI",
    "cited answers",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Cognitum Learn",
    title: TITLE,
    description: DESCRIPTION,
    // image is auto-picked up from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    // image is auto-picked up from app/twitter-image.tsx
  },
  // icon, apple-icon, manifest auto-picked up from app/icon.svg + app/apple-icon.tsx
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

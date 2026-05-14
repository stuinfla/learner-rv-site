import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "learn-rv — turn YouTube videos into a queryable knowledge base",
  description:
    "Pure-Rust CLI that ingests video sources into per-topic RVF stores you can query, quiz, and push to your Cognitum One Seed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vata Mitra (वाता मित्र) — AI Urban Air Quality Assistant",
  description:
    "Generative AI Urban Air Quality Assistant for Indian households. Real-time CPCB NAQI calculations, city-specific transit rules, and personalized low-emission household action plans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-vm-page text-vm-text transition-colors">
        {children}
      </body>
    </html>
  );
}

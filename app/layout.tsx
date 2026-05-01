import type { Metadata } from "next";
import { Inter, Anton, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "APL Season 3 — Akshar Premier League",
    template: "%s | APL Season 3",
  },
  description:
    "Where cricket meets character. Register for APL Season 3 — Brotherhood, Atmiyata, Discipline, Surrender, Prayer & Growth. Opening 14·06·2026 at Akshar Arena.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Akshar Premier League",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-apl-ink text-white antialiased">{children}</body>
    </html>
  );
}

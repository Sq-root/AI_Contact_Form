import type { Metadata } from "next";
import { Inter, Anton, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { APL_SEASON } from "@/lib/constants";

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

const seasonNum = parseInt(APL_SEASON.number, 10);
const venueName = APL_SEASON.venue.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

export const metadata: Metadata = {
  title: {
    default: `${APL_SEASON.leagueShort} Season ${seasonNum} — ${APL_SEASON.leagueName}`,
    template: `%s | ${APL_SEASON.leagueShort} Season ${seasonNum}`,
  },
  description:
    `Where cricket meets character. Register for ${APL_SEASON.leagueShort} Season ${seasonNum} — Brotherhood, Atmiyata, Discipline, Surrender, Prayer & Growth. Opening ${APL_SEASON.opening} at ${venueName}.`,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: APL_SEASON.leagueName,
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

import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import MobileMenu from "@/components/ui/MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-[25px] z-[29] border-b border-white/[0.07]">
      {/*
        Glass layer lives in a child element — NOT on <header> itself.
        backdrop-filter / filter / transform on a parent turns it into the
        containing block for position:fixed descendants, so the mobile-menu
        overlay (fixed inset-0) would only cover the header bar instead of
        the full viewport. Moving the blur here breaks that trap.
      */}
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.82)] backdrop-blur-[14px]" />

      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3 md:px-10 md:py-[14px] lg:px-16">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <div
            className="grid animate-apl-spin place-items-center rounded-full bg-apl-yellow font-anton text-apl-ink shrink-0
                       h-8 w-8 text-[13px]
                       md:h-10 md:w-10 md:text-[16px]"
            aria-hidden="true"
          >
            A
          </div>
          <div className="font-anton leading-[1.15] tracking-[1.5px]
                          text-[11px]
                          md:text-[13px] md:tracking-[2px]">
            AKSHAR PREMIER
            <span className="block text-apl-yellow
                             text-[8px] tracking-[1.5px]
                             md:text-[9px] md:tracking-[2px]">
              SEASON · 03
            </span>
          </div>
        </Link>

        {/* ── Desktop nav ───────────────────────────────────────────────── */}
        <nav className="hidden items-center gap-8 md:flex lg:gap-10" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-mono tracking-[2px] text-white/60 transition-colors hover:text-white
                         text-[10px] md:text-[11px]
                         after:absolute after:-bottom-[2px] after:left-0 after:h-[1px] after:w-0 after:bg-apl-yellow after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Right side: CTA + hamburger ───────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="hidden bg-apl-red font-anton tracking-[1.5px] text-white transition-all hover:bg-red-600 active:scale-[0.97]
                       md:block md:px-5 md:py-[10px] md:text-[12px]
                       lg:px-6 lg:py-[11px] lg:text-[13px]"
          >
            JOIN ↗
          </Link>
          {/* Mobile hamburger (client) */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { APL_SEASON } from "@/lib/constants";

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-[29] border-b border-white/[0.08]">
      <div className="absolute inset-0 bg-[#041412]/72 backdrop-blur-[18px]" />

      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3 md:px-10 md:py-[14px] lg:px-16">
        <Link href="/admin" className="group flex items-center gap-3">
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-apl-gold font-anton text-[13px] text-apl-ink shadow-[0_0_28px_rgba(244,190,64,0.3)] md:h-10 md:w-10 md:text-[16px]"
            aria-hidden="true"
          >
            {APL_SEASON.monogram}
          </div>
          <div className="font-anton text-[11px] leading-[1.15] tracking-[1.5px] uppercase md:text-[13px] md:tracking-[2px]">
            {APL_SEASON.leagueName.split(" ").slice(0, 2).join(" ")}
            <span className="block text-[8px] tracking-[1.5px] text-apl-gold md:text-[9px] md:tracking-[2px]">
              SEASON {APL_SEASON.number}
            </span>
          </div>
        </Link>

        {/* Desktop smooth scroll navigation */}
        {/* <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-[2.5px] uppercase text-white/50">
          <Link href="/#about" className="transition hover:text-apl-gold">
            About
          </Link>
          <Link href="/#pillars" className="transition hover:text-apl-gold">
            Pillars
          </Link>
          <Link href="/#gallery" className="transition hover:text-apl-gold">
            Gallery
          </Link>
        </nav> */}

        <Link
          href="/register"
          className="rounded-md border border-apl-gold/30 bg-white/[0.08] px-4 py-[9px] font-anton text-[11px] tracking-[1.5px] text-white transition-all hover:border-apl-gold hover:text-apl-gold active:scale-[0.97] md:px-5 md:py-[10px] md:text-[12px] lg:px-6 lg:py-[11px] lg:text-[13px]"
        >
          JOIN
        </Link>
      </div>
    </header>
  );
}

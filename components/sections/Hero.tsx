import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    /*
     * Height = visible viewport minus the ~80px ticker + header stack.
     * 100svh uses the small viewport height (excludes browser chrome on mobile).
     * min-h prevents the section from collapsing on very short screens.
     */
    <section
      className="relative flex flex-col overflow-hidden min-h-[560px]"
      style={{ height: "calc(100svh - 80px)" }}
    >
      {/* ── Background image ─────────────────────────────────────────── */}
      <div className="absolute inset-0 animate-hero-pan">
        <Image
          src="/images/team-celebration.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%] brightness-[0.40] contrast-[1.1] saturate-[0.9]"
        />
      </div>

      {/* ── Multi-layer gradient overlay ─────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 25%)",
            "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 40%, transparent 75%)",
            "linear-gradient(to right, rgba(10,10,10,0.5) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* ── Subtle grid overlay ──────────────────────────────────────── */}
      <div className="bg-grid absolute inset-0 opacity-[0.15]" aria-hidden="true" />

      {/* ── Animated cricket ball ─────────────────────────────────────── */}
      <div
        className="absolute z-[2] animate-apl-float rounded-full
                   right-4 top-8 h-10 w-10
                   sm:right-8 sm:top-12 sm:h-14 sm:w-14
                   md:right-12 md:top-16 md:h-16 md:w-16
                   lg:right-20 lg:top-20 lg:h-[72px] lg:w-[72px]"
        style={{
          background: "radial-gradient(circle at 35% 30%, #ff5a5a, #c1121f 60%, #6a0a14)",
          boxShadow: "0 0 40px rgba(255,80,80,0.35), inset -6px -8px 14px rgba(0,0,0,0.5)",
        }}
        aria-hidden="true"
      >
        <div className="absolute rounded-full border border-dashed border-white/50" style={{ inset: "8px 4px", transform: "rotate(20deg)" }} />
        <div className="absolute rounded-full border border-dashed border-white/50" style={{ inset: "4px 8px", transform: "rotate(-20deg)" }} />
      </div>

      {/* ── Hero content — flex mt-auto pushes to bottom reliably ──────── */}
      <div className="relative z-[3] mt-auto w-full">
        <div className="mx-auto max-w-[1280px] px-5 pb-12 md:px-10 md:pb-12 lg:px-16 lg:pb-20">

          {/* Live badge
              Mobile: centered | Desktop: left-aligned */}
          <div className="animate-line-up-1 mb-5 flex lg:block">
            <div className="inline-flex items-center gap-2 bg-apl-red font-mono uppercase tracking-[2px]
                            mx-auto lg:mx-0
                            px-[10px] py-[5px] text-[9px]
                            md:px-3 md:py-[6px] md:text-[10px]">
              <span className="h-[5px] w-[5px] animate-apl-pulse rounded-full bg-white md:h-[6px] md:w-[6px]" />
              SEASON 03 · NOW REGISTERING
            </div>
          </div>

          {/* ── Headline ──────────────────────────────────────────────────
               Mobile / tablet  → 4 stacked lines, CENTER-aligned
                                  (4 lines have very different widths — centring
                                   makes the asymmetry look intentional, like a
                                   sports-poster layout)
               Desktop (lg+)    → 2 wide lines, LEFT-aligned
                                  (each line spans ~70-86 % of container width)
          ────────────────────────────────────────────────────────────── */}
          <h1 className="m-0 font-anton uppercase leading-[0.85]
                         text-center lg:text-left
                         text-[clamp(52px,8vw,108px)]">

            {/* ─── Mobile / tablet: 4 lines ─── */}
            <span className="block overflow-hidden lg:hidden">
              <span className="animate-line-up-1 inline-block">WHERE</span>
            </span>
            <span className="block overflow-hidden lg:hidden">
              <span className="animate-line-up-2 inline-block text-apl-yellow">CRICKET</span>
            </span>
            <span className="block overflow-hidden lg:hidden">
              <span className="animate-line-up-3 inline-block">MEETS</span>
            </span>
            <span className="block overflow-hidden lg:hidden">
              <span className="animate-line-up-4 inline-block text-stroke-yellow">CHARACTER.</span>
            </span>

            {/* ─── Desktop: 2 wide lines ─── */}
            <span className="hidden overflow-hidden lg:block">
              <span className="animate-line-up-1 inline-block">
                WHERE&nbsp;<span className="text-apl-yellow">CRICKET</span>
              </span>
            </span>
            <span className="hidden overflow-hidden lg:block">
              <span className="animate-line-up-2 inline-block">
                MEETS&nbsp;<span className="text-stroke-yellow">CHARACTER.</span>
              </span>
            </span>
          </h1>

          {/* CTA row
              Mobile: full-width button + centered meta text
              Desktop: inline button + meta text beside it */}
          <div className="animate-fade-up mt-6 flex flex-col items-stretch gap-3
                          sm:flex-row sm:items-center sm:gap-6
                          md:mt-7 lg:mt-8 lg:items-center lg:justify-start">
            <Link
              href="/register"
              className="shimmer active-scale relative block overflow-hidden bg-apl-yellow font-anton tracking-[1.5px] text-apl-ink transition-transform hover:-translate-y-[1px]
                         text-center px-5 py-[15px] text-[15px]
                         sm:inline-block sm:w-auto
                         md:px-7 md:py-4 md:text-[16px]
                         lg:px-9 lg:py-5 lg:text-[18px]"
            >
              JOIN SEASON 3 →
            </Link>
            <p className="font-mono text-white/55 tracking-[2px] text-center
                          text-[9px]
                          sm:text-left
                          md:text-[10px]
                          lg:text-[11px]">
              OPENING · 14·06·2026 · AKSHAR ARENA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

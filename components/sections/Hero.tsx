import Image from "next/image";
import Link from "next/link";
import { APL_SEASON } from "@/lib/constants";

export default function Hero() {
  const seasonNum = parseInt(APL_SEASON.number, 10);

  return (
    <section className="relative min-h-screen overflow-hidden bg-apl-ink text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/cs.png"
          alt="Modern night cricket stadium with bright gold and green floodlights"
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover object-center brightness-[0.88] contrast-[1.08] saturate-[1.08]"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(90deg, rgba(5,31,21,0.97) 0%, rgba(5,31,21,0.88) 38%, rgba(5,31,21,0.38) 72%, rgba(5,31,21,0.68) 100%)",
            "linear-gradient(180deg, rgba(5,31,21,0.38) 0%, rgba(5,31,21,0.08) 42%, rgba(5,31,21,0.95) 100%)",
            "radial-gradient(circle at 78% 24%, rgba(242,201,76,0.18), transparent 32%)",
          ].join(", "),
        }}
      />
      <div
        className="bg-pitch-lines absolute inset-0 opacity-[0.18]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1280px] items-center lg:items-end px-5 pb-16 pt-32 md:px-10 md:pb-12 lg:px-16 lg:pb-14">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.95fr)_420px] lg:items-end">
          <div className="max-w-[780px] flex flex-col items-center text-center md:items-start md:text-left mx-auto md:mx-0">
            <div className="animate-line-up-1 mb-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-white/78 shadow-[0_12px_50px_rgba(0,0,0,0.24)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-apl-gold shadow-[0_0_18px_rgba(244,190,64,0.8)]" />
              Season {APL_SEASON.number} registration open
            </div>

            <h1 className="m-0 max-w-[860px] font-anton uppercase leading-[1] md:leading-[0.88] tracking-normal text-[clamp(52px,9vw,122px)]">
              <span className="block overflow-hidden">
                <span className="animate-line-up-1 inline-block">
                  {APL_SEASON.headlineLine1}
                </span>
              </span>
              <span className="block overflow-hidden text-apl-gold">
                <span className="animate-line-up-2 inline-block">
                  {APL_SEASON.headlineLine2}
                </span>
              </span>
            </h1>

            <p className="animate-fade-up mt-6 max-w-[610px] text-base leading-7 text-white/76 md:text-lg md:leading-8">
              Join {APL_SEASON.leagueName} for a disciplined, high-energy
              cricket season built around teams, skill, brotherhood, and
              match-day intensity.
            </p>

            <div className="animate-fade-up mt-8 flex flex-col items-center md:items-start gap-5">
              <Link
                href="/register"
                className="shimmer active-scale relative inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#fef0b9] to-apl-gold px-6 md:px-8 py-3 font-anton text-[14px] md:text-[15px] uppercase tracking-[1.5px] text-[#03150e] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_12px_30px_rgba(242,201,76,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_20px_40px_rgba(242,201,76,0.45)] border border-[#fce69a] text-center"
              >
                <span>Register for Season {seasonNum} &nbsp;&rarr;</span>
              </Link>

              <div className="flex items-center text-center md:text-left gap-3 font-mono text-[9px] sm:text-[11px] uppercase tracking-[2px] text-white/70">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-apl-gold"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="leading-[1.5]">
                  <span className="text-white/40">Opening</span>{" "}
                  {APL_SEASON.opening}
                  <span className="mx-2 text-apl-gold/40">|</span>
                  {APL_SEASON.venue}
                </span>
              </div>
            </div>
          </div>

          <div className="animate-fade-up hidden rounded-lg border border-white/16 bg-white/[0.1] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-md lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#06251f]">
              <Image
                src="/images/cs.png"
                alt="Modern night cricket stadium with bright gold and green floodlights"
                fill
                priority
                loading="eager"
                sizes="420px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-apl-ink/80 via-apl-ink/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[2px] text-white/62">
                    Player pool
                  </p>
                  <p className="mt-1 font-anton text-4xl text-white">
                    {APL_SEASON.players}
                  </p>
                </div>
                <div className="rounded-full bg-apl-green px-3 py-2 font-mono text-[10px] uppercase tracking-[1.5px] text-white">
                  T10 format
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-up grid grid-cols-3 gap-2 border-t border-white/12 pt-5 font-mono text-[10px] uppercase tracking-[1.5px] text-white/64 text-center md:text-left lg:col-span-2 lg:max-w-[760px] lg:grid-cols-4">
            <span>
              <strong className="block font-anton text-2xl text-white">
                {APL_SEASON.teams}
              </strong>
              Teams
            </span>
            <span>
              <strong className="block font-anton text-2xl text-white">
                {APL_SEASON.players}
              </strong>
              Players
            </span>
            <span>
              <strong className="block font-anton text-2xl text-white">
                6
              </strong>
              Overs
            </span>
            <span className="hidden lg:block">
              <strong className="block font-anton text-2xl text-white">
                {APL_SEASON.number}
              </strong>
              Season
            </span>
          </div>
        </div>
      </div>

      {/* <a
        href="/admin"
        className="absolute bottom-3 right-4 z-10 font-mono text-[9px] tracking-[2px] text-white/20 transition hover:text-apl-gold md:bottom-4 md:right-6"
      >
        ADMIN
      </a> */}
    </section>
  );
}

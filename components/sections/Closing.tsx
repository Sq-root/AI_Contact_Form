import Link from "next/link";
import { APL_SEASON } from "@/lib/constants";

export default function Closing() {
  const rows: { label: string; value: string }[] = [
    { label: "OPENING", value: APL_SEASON.opening },
    { label: "VENUE",   value: APL_SEASON.venue   },
    { label: "FORMAT",  value: APL_SEASON.format  },
    { label: "TEAMS",   value: APL_SEASON.teams   },
    { label: "PLAYERS", value: APL_SEASON.players },
  ];

  return (
    <section className="relative overflow-hidden border-t-[3px] border-apl-yellow bg-apl-red">
      {/* Diagonal stripe */}
      <div className="bg-stripe pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-18 lg:px-16 lg:py-24">

        {/* ── Mobile: stacked  |  Desktop: two columns ─────────────────── */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">

          {/* Left — headline + CTA */}
          <div className="lg:flex-1">
            <p className="mb-4 font-mono text-[10px] tracking-[3px] text-apl-yellow md:text-[11px]">
              // 04 — JOIN US
            </p>
            <h2 className="m-0 font-anton uppercase leading-[0.82] text-white
                           text-[clamp(52px,8vw,88px)]">
              SEASON 3
              <br />
              <span className="text-apl-yellow">IS CALLING.</span>
            </h2>

            {/* CTA — desktop only (mobile CTA below ticket) */}
            <Link
              href="/register"
              className="active-scale mt-8 hidden border-2 border-apl-yellow bg-apl-ink font-anton tracking-[1.5px] text-apl-yellow transition-all hover:bg-apl-yellow hover:text-apl-ink
                         lg:inline-block
                         px-8 py-5 text-[17px]"
            >
              REGISTER NOW →
            </Link>
          </div>

          {/* Right — season ticket card */}
          <div className="flex flex-col gap-4 lg:w-[380px] xl:w-[420px]">
            <div className="border border-dashed border-white/35 bg-black/35 font-mono leading-[2] tracking-[1px] text-white
                            p-5 text-[11px]
                            md:p-7 md:text-[12px]">
              <div className="mb-3 border-b border-dashed border-white/25 pb-3 font-anton tracking-[1.5px]
                              text-[20px] md:text-[24px]">
                SEASON · 03 · TICKET
              </div>
              {rows.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between py-[1px]">
                  <span className="opacity-55">{label}</span>
                  <span className="font-medium text-apl-yellow">{value}</span>
                </div>
              ))}
            </div>

            {/* CTA — shows on mobile below ticket, hidden on lg */}
            <Link
              href="/register"
              className="active-scale block border-2 border-apl-yellow bg-apl-ink text-center font-anton tracking-[1.5px] text-apl-yellow transition-all hover:bg-apl-yellow hover:text-apl-ink lg:hidden
                         px-6 py-5 text-[16px]
                         md:text-[17px]"
            >
              REGISTER NOW →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

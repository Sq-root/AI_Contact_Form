import { APL_VALUES } from "@/lib/constants";

export default function About() {
  return (
    <section id="about" className="border-t border-apl-line bg-apl-ink">
      <div className="mx-auto max-w-[1280px] px-5 pt-14 pb-10 md:px-10 md:pt-16 md:pb-12 lg:px-16 lg:pb-14">

        {/* ── Section meta row ─────────────────────────────────────────── */}
        <div className="mb-10 flex items-center justify-between md:mb-12">
          <p className="font-mono text-[10px] tracking-[3px] text-apl-yellow md:text-[11px]">
            // 01 — ABOUT
          </p>
          <p className="hidden font-mono text-[10px] tracking-[2px] text-white/25 md:block">
            APL SEASON 03
          </p>
        </div>

        {/* ── Heading + body ─────────────────────────────────────────────
            Mobile:  stacked column
            Desktop: heading left (52%), body right (flex-1)
            Both bottom-aligned on desktop so they share the same baseline
        ──────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
          <h2 className="m-0 font-anton uppercase leading-[0.88]
                         text-[clamp(34px,4.5vw,60px)]
                         lg:w-[52%]">
            NOT A TOURNAMENT.
            <br />
            <span className="text-apl-red">A BROTHERHOOD</span>
            <br />
            WITH A SCOREBOARD.
          </h2>

          <p className="leading-[1.75] text-apl-body
                        text-[14px] max-w-[520px]
                        md:text-[16px]
                        lg:flex-1 lg:max-w-none lg:pb-[6px]">
            APL is brotherhood,{" "}
            <strong className="font-semibold text-apl-yellow">Atmiyata</strong>,
            discipline, surrender, prayer, and spiritual growth — through cricket.
            The emotional core isn&apos;t winning trophies. It&apos;s building{" "}
            <strong className="font-semibold text-apl-yellow">character</strong>{" "}
            and divine connection.
          </p>
        </div>

        {/* ── Values strip: 2 cols → 3 cols (md) → 6 cols (lg) ────────── */}
        <div className="mt-12 border border-apl-line md:mt-14" aria-label="APL core values">
          <div className="grid grid-cols-2 gap-px bg-apl-line md:grid-cols-3 lg:grid-cols-6">
            {APL_VALUES.map((value, i) => (
              <div
                key={value}
                className="flex flex-col items-center justify-center bg-apl-ink py-5 font-anton uppercase tracking-[1.2px] text-[13px] md:text-[14px]"
              >
                <span className="mb-[5px] font-mono text-[8px] tracking-[2px] text-apl-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

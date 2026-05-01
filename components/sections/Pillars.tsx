import Image from "next/image";
import { APL_PILLARS } from "@/lib/constants";

export default function Pillars() {
  return (
    <section id="pillars" className="border-t border-apl-line bg-apl-ink">

      {/* ── Section heading — inside container ───────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-5 pb-8 pt-10 md:px-10 md:pb-10 md:pt-12 lg:px-16 lg:pt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[3px] text-apl-yellow md:text-[11px]">
              // 02 — THE EXPERIENCE
            </p>
            <h2 className="m-0 font-anton uppercase leading-[0.88]
                           text-[clamp(34px,4.5vw,60px)]">
              FOUR PILLARS
              <br />
              <span className="text-apl-yellow">ONE FAMILY.</span>
            </h2>
          </div>
          <p className="font-mono text-[10px] tracking-[2px] text-white/25 md:text-[11px]">
            02 / 04 SECTIONS
          </p>
        </div>
      </div>

      {/* ── Pillar cards — 2×2 grid, full-bleed images ───────────────── */}
      <div className="grid gap-[2px] grid-cols-1 md:grid-cols-2">
        {APL_PILLARS.map((pillar) => (
          <div
            key={pillar.num}
            className="group relative overflow-hidden bg-apl-surface
                       h-[280px]
                       sm:h-[340px]
                       md:h-[380px]
                       lg:h-[440px]"
          >
            {/* Image */}
            <Image
              src={pillar.src}
              alt={pillar.label}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ objectPosition: pillar.pos }}
            />

            {/* Gradient — stronger at bottom for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.92) 100%)",
              }}
            />

            {/* Num badge */}
            <div className="absolute bg-apl-yellow font-mono tracking-[1.5px] text-apl-ink
                            left-4 top-4 px-2 py-1 text-[9px]
                            md:left-5 md:top-5 md:px-3 md:text-[10px]">
              {pillar.num}
            </div>

            {/* Text caption */}
            <div className="absolute text-white
                            bottom-5 left-5 right-5
                            md:bottom-7 md:left-7 md:right-7">
              <p className="mb-1 font-mono tracking-[2px] text-apl-yellow
                            text-[9px] md:text-[10px]">
                PILLAR {pillar.num}
              </p>
              <h3 className="font-anton uppercase leading-[0.9] tracking-[0.5px]
                             text-[30px]
                             md:text-[38px]
                             lg:text-[46px]">
                {pillar.label}
              </h3>
              <p className="mt-2 text-white/80
                            text-[12px] md:text-[14px] leading-[1.55]">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

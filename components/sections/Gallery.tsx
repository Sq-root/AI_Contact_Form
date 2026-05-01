import Image from "next/image";
import { APL_GALLERY } from "@/lib/constants";

export default function Gallery() {
  return (
    <section id="gallery" className="border-t border-apl-line bg-apl-ink">

      {/* ── Heading ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-5 pb-8 pt-14 md:px-10 md:pb-10 md:pt-18 lg:px-16 lg:pt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[3px] text-apl-yellow md:text-[11px]">
              // 03 — A SEASON IN PHOTOS
            </p>
            <h2 className="m-0 font-anton uppercase leading-[0.88]
                           text-[clamp(30px,4vw,52px)]">
              From the first{" "}
              <span className="text-apl-red">blessing</span>
              <br className="hidden sm:block" /> to the final{" "}
              <span className="text-apl-red">banyan.</span>
            </h2>
          </div>
          <p className="font-mono text-[10px] tracking-[2px] text-white/25 md:text-[11px]">
            03 / 04 SECTIONS
          </p>
        </div>
      </div>

      {/* ── Photo grid: 2 col mobile → 4 col desktop ─────────────────── */}
      <div className="grid gap-[2px]
                      grid-cols-2
                      md:grid-cols-4">
        {APL_GALLERY.map((item) => (
          <div
            key={item.n}
            className="group relative overflow-hidden bg-apl-surface"
            style={{ aspectRatio: "3/4" }}
          >
            <Image
              src={item.src}
              alt={item.cap}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={{ objectPosition: item.pos }}
            />

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)",
              }}
            />

            {/* Number */}
            <span className="absolute font-anton text-apl-yellow [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]
                             left-3 top-3 text-[22px]
                             md:left-4 md:top-4 md:text-[28px]">
              {item.n}
            </span>

            {/* Caption */}
            <div className="absolute bg-black/55 font-mono tracking-[1.5px] text-white backdrop-blur-[2px]
                            bottom-3 left-3 right-3 px-2 py-[5px] text-[7px]
                            md:bottom-4 md:left-4 md:right-4 md:px-3 md:py-[6px] md:text-[9px]">
              {item.cap}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

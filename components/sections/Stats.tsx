import { APL_STATS } from "@/lib/constants";

export default function Stats() {
  return (
    <div
      className="grid border-y border-white/[0.08] bg-gradient-to-r from-apl-ink via-[#051d1a] to-apl-ink text-white"
      style={{ gridTemplateColumns: `repeat(${APL_STATS.length}, 1fr)` }}
      aria-label="Season statistics"
    >
      {APL_STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center
                     py-4 md:py-6 lg:py-8"
          style={{
            borderRight:
              i < APL_STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
          <div className="font-anton leading-none text-apl-gold drop-shadow-[0_0_15px_rgba(246,200,95,0.25)]
                          text-[28px]
                          md:text-[44px]
                          lg:text-[56px]">
            {stat.number}
          </div>
          <div className="mt-1 font-mono tracking-[2.5px] text-white/55
                          text-[8px]
                          md:text-[10px]
                          lg:text-[11px]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

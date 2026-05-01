import { APL_STATS } from "@/lib/constants";

export default function Stats() {
  return (
    <div
      className="grid border-y-[3px] border-apl-ink bg-apl-yellow text-apl-ink"
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
              i < APL_STATS.length - 1 ? "1px solid rgba(0,0,0,0.15)" : "none",
          }}
        >
          <div className="font-anton leading-none
                          text-[28px]
                          md:text-[44px]
                          lg:text-[56px]">
            {stat.number}
          </div>
          <div className="mt-1 font-mono tracking-[2px] opacity-70
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

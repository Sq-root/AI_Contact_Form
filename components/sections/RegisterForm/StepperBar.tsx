import { STEPS } from "./types";

export function StepperBar({ current }: { current: number }) {
  return (
    <div className="px-6 py-5 md:px-12">
      <div className="relative flex items-start justify-between">
        {/* Track line between step circles */}
        <div className="absolute inset-x-[18px] top-[18px] h-px bg-white/[0.06]">
          <div
            className="h-full bg-apl-yellow/60 transition-all duration-500 ease-in-out"
            style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map(({ n, label }) => {
          const done   = n < current;
          const active = n === current;
          return (
            <div key={n} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center font-mono text-[11px] transition-all duration-300 ${
                  done
                    ? "bg-apl-yellow text-apl-ink"
                    : active
                    ? "border-2 border-apl-yellow bg-apl-ink text-apl-yellow"
                    : "border border-white/15 bg-apl-ink text-white/25"
                }`}
                style={
                  active
                    ? { boxShadow: "0 0 0 4px var(--apl-ink), 0 0 16px rgba(255,195,31,0.4)" }
                    : undefined
                }
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2 6l3 3 5-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  `0${n}`
                )}
              </div>
              <span
                className={`hidden font-mono text-[8px] uppercase tracking-[1.5px] transition-colors sm:block ${
                  active ? "text-apl-yellow" : done ? "text-white/45" : "text-white/20"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

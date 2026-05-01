import { TICKER_TEXT } from "@/lib/constants";

export default function Ticker() {
  return (
    <div
      className="sticky top-0 z-30 overflow-hidden whitespace-nowrap border-b border-apl-line bg-apl-ink py-[7px]"
      aria-hidden="true"
    >
      <div className="inline-block animate-ticker font-mono tracking-[2px] text-apl-yellow text-[9px] md:text-[10px]">
        {TICKER_TEXT}
      </div>
    </div>
  );
}

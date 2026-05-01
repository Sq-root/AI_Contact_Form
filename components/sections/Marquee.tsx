export default function Marquee() {
  const items = ["WHERE CRICKET MEETS", "CHARACTER"];

  return (
    <div
      className="overflow-hidden whitespace-nowrap border-b-2 border-t-2 border-apl-ink bg-apl-yellow py-4 md:py-6 lg:py-8"
      aria-hidden="true"
    >
      <div className="inline-block animate-ticker-fast">
        {[1, 2, 3].map((i) => (
          <span key={i}>
            <span className="font-anton tracking-[1px] text-apl-ink mx-3 text-[28px] md:mx-5 md:text-[40px] lg:text-[48px]">
              {items[0]}
            </span>
            <span className="text-apl-red mx-2 text-[16px] md:text-[24px]">●</span>
            <span className="font-anton tracking-[1px] text-stroke-ink mx-3 text-[28px] md:mx-5 md:text-[40px] lg:text-[48px]">
              {items[1]}
            </span>
            <span className="text-apl-red mx-2 text-[16px] md:text-[24px]">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

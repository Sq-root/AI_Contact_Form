export default function Marquee() {
  const items = ["WHERE CRICKET MEETS", "CHARACTER"];

  return (
    <div
      className="overflow-hidden whitespace-nowrap border-y border-white/[0.08] bg-gradient-to-r from-apl-ink via-[#051d1a] to-apl-ink py-4 md:py-6 lg:py-7"
      aria-hidden="true"
    >
      <div className="inline-block animate-ticker-fast">
        {[1, 2, 3].map((i) => (
          <span key={i}>
            <span className="font-anton tracking-[1.5px] text-apl-gold mx-3 text-[28px] md:mx-5 md:text-[40px] lg:text-[48px] drop-shadow-[0_0_15px_rgba(246,200,95,0.22)]">
              {items[0]}
            </span>
            <span className="text-apl-red/80 mx-2 text-[16px] md:text-[24px]">●</span>
            <span className="font-anton tracking-[1.5px] text-stroke-yellow mx-3 text-[28px] md:mx-5 md:text-[40px] lg:text-[48px]">
              {items[1]}
            </span>
            <span className="text-apl-red/80 mx-2 text-[16px] md:text-[24px]">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

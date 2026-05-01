import React from "react";

export function StepHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title:   React.ReactNode;
  sub:     string;
}) {
  return (
    <div className="mb-9">
      <p className="mb-2 font-mono text-[10px] tracking-[2.5px] text-apl-red/75">{eyebrow}</p>
      <h2 className="mb-3 font-anton text-[40px] uppercase leading-[0.88] md:text-[56px]">
        {title}
      </h2>
      <p className="font-sans text-[14px] leading-relaxed text-white/40">{sub}</p>
    </div>
  );
}

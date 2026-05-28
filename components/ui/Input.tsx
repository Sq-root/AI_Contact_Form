import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label:  string;
  error?: string;
  hint?:  string;
}

export function Input({ label, error, hint, required, className, ...props }: InputProps) {
  return (
    <div className="mb-6">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/45">
          {label}
          {required && <span className="ml-1.5 text-apl-yellow">✦</span>}
        </span>
        {hint && (
          <span className="font-mono text-[8px] tracking-[0.5px] text-white/25">{hint}</span>
        )}
      </div>

      <input
        required={required}
        {...props}
        className={`w-full border bg-white/[0.04] px-4 py-[15px] font-sans text-[17px] text-white outline-none transition-all placeholder:text-white/20 ${
          error
            ? "border-apl-red/50 bg-apl-red/5 focus:border-apl-red/70"
            : "border-white/[0.09] focus:border-apl-yellow focus:bg-white/[0.08]"
        } ${className ?? ""}`}
      />

      {error && (
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.5px] text-apl-red">
          <span>✕</span>
          {error}
        </p>
      )}
    </div>
  );
}

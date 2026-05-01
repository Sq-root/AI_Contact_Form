import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label:  string;
  error?: string;
}

export function Textarea({ label, error, required, className, ...props }: TextareaProps) {
  return (
    <div className="mb-6">
      <div className="mb-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/45">
          {label}
          {required && <span className="ml-1.5 text-apl-yellow">✦</span>}
        </span>
      </div>

      <textarea
        required={required}
        rows={4}
        {...props}
        className={`w-full resize-none border bg-[#0d0d0d] px-4 py-[15px] font-sans text-[17px] text-white outline-none transition-all placeholder:text-white/20 ${
          error
            ? "border-apl-red/50 bg-apl-red/5"
            : "border-white/[0.09] focus:border-apl-yellow focus:bg-[#111]"
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

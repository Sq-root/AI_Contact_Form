interface TileSelectProps {
  label:          string;
  options:        readonly string[];
  value:          string;
  onChange:       (v: string) => void;
  cols?:          number;
  required?:      boolean;
  error?:         string;
  hint?:          string;
  /* "Other" mode — renders a text input when value === "Other" */
  withOther?:     boolean;
  otherValue?:    string;
  onOtherChange?: (v: string) => void;
  otherError?:    string;
}

function Tile({
  label,
  selected,
  onClick,
}: {
  label:    string;
  selected: boolean;
  onClick:  () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative border px-4 py-[18px] text-left font-anton text-[14px] uppercase tracking-[1px] transition-all duration-150 active:scale-[0.97] md:text-[16px] ${
        selected
          ? "border-apl-yellow bg-apl-yellow text-apl-ink"
          : "border-white/[0.09] bg-[#0d0d0d] text-white hover:border-apl-yellow/40 hover:bg-[#141414]"
      }`}
    >
      <span
        className={`absolute right-3 top-3 h-1.5 w-1.5 rounded-full transition-all duration-200 ${
          selected ? "scale-100 bg-apl-ink" : "scale-0 bg-transparent"
        }`}
      />
      {label}
    </button>
  );
}

export function TileSelect({
  label,
  options,
  value,
  onChange,
  cols = 2,
  required,
  error,
  hint,
  withOther,
  otherValue = "",
  onOtherChange,
  otherError,
}: TileSelectProps) {
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

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(options.length, cols)}, 1fr)` }}
      >
        {options.map((o) => (
          <Tile key={o} label={o} selected={value === o} onClick={() => onChange(o)} />
        ))}
      </div>

      {withOther && value === "Other" && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange?.(e.target.value)}
          placeholder="Please specify…"
          autoFocus
          className={`mt-2 w-full border bg-[#0d0d0d] px-4 py-[15px] font-sans text-[17px] text-white outline-none transition-all placeholder:text-white/20 ${
            otherError
              ? "border-apl-red/50 bg-apl-red/5"
              : "border-white/[0.09] focus:border-apl-yellow"
          }`}
        />
      )}

      {(error || otherError) && (
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.5px] text-apl-red">
          <span>✕</span>
          {error ?? otherError}
        </p>
      )}
    </div>
  );
}

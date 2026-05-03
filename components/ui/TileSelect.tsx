interface TileBase {
  label:     string;
  options:   readonly string[];
  cols?:     number;
  required?: boolean;
  error?:    string;
  hint?:     string;
}

interface TileSelectSingle extends TileBase {
  multi?:         false;
  value:          string;
  onChange:       (v: string) => void;
  withOther?:     boolean;
  otherValue?:    string;
  onOtherChange?: (v: string) => void;
  otherError?:    string;
}

interface TileSelectMulti extends TileBase {
  multi:    true;
  value:    string[];
  onChange: (v: string[]) => void;
}

type TileSelectProps = TileSelectSingle | TileSelectMulti;

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

export function TileSelect(props: TileSelectProps) {
  const { label, options, cols = 2, required, error, hint } = props;

  const isSelected = (o: string) =>
    props.multi ? props.value.includes(o) : props.value === o;

  const handleClick = (o: string) => {
    if (props.multi) {
      const next = props.value.includes(o)
        ? props.value.filter((v) => v !== o)
        : [...props.value, o];
      props.onChange(next);
    } else {
      props.onChange(o);
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/45">
          {label}
          {required && <span className="ml-1.5 text-apl-yellow">✦</span>}
        </span>
        {(hint || props.multi) && (
          <span className="font-mono text-[8px] tracking-[0.5px] text-white/25">
            {hint ?? "SELECT ALL THAT APPLY"}
          </span>
        )}
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(options.length, cols)}, 1fr)` }}
      >
        {options.map((o) => (
          <Tile key={o} label={o} selected={isSelected(o)} onClick={() => handleClick(o)} />
        ))}
      </div>

      {!props.multi && props.withOther && props.value === "Other" && (
        <input
          type="text"
          value={props.otherValue ?? ""}
          onChange={(e) => props.onOtherChange?.(e.target.value)}
          placeholder="Please specify…"
          autoFocus
          className={`mt-2 w-full border bg-[#0d0d0d] px-4 py-[15px] font-sans text-[17px] text-white outline-none transition-all placeholder:text-white/20 ${
            props.otherError
              ? "border-apl-red/50 bg-apl-red/5"
              : "border-white/[0.09] focus:border-apl-yellow"
          }`}
        />
      )}

      {(error || (!props.multi && props.otherError)) && (
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.5px] text-apl-red">
          <span>✕</span>
          {error ?? (!props.multi ? props.otherError : undefined)}
        </p>
      )}
    </div>
  );
}
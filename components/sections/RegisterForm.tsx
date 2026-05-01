"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { uploadImage } from "@/lib/supabase";
import {
  FIELD_OF_STUDY_OPTIONS,
  BATTING_STYLES,
  BOWLING_STYLES,
  SABHA_LIKES,
  APL_SEASON,
} from "@/lib/constants";
import type { FormData } from "@/types";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface UploadItem {
  id: string;
  file: File;
  localUrl: string;
  storageUrl: string | null;
  uploading: boolean;
  error: string | null;
}

type FieldErrors = Partial<Record<keyof FormData | "_server", string>>;

/* ─── Step config ─────────────────────────────────────────────────────────── */

const STEPS = [
  { n: 1, label: "YOU"     },
  { n: 2, label: "CRICKET" },
  { n: 3, label: "SABHA"   },
  { n: 4, label: "PHOTOS"  },
] as const;

/* ─── Per-step validation ─────────────────────────────────────────────────── */

function validateStep(step: number, data: FormData): FieldErrors {
  const e: FieldErrors = {};
  if (step === 1) {
    if (!data.fullName.trim())
      e.fullName = "Full name is required";
    const phone = data.phone.replace(/[\s\-()+]/g, "");
    if (!/^(91|0)?[6-9]\d{9}$/.test(phone))
      e.phone = "Enter a valid 10-digit Indian number";
    if (!data.fieldOfStudy)
      e.fieldOfStudy = "Please select one";
    if (data.fieldOfStudy === "Other" && !data.fieldOfStudyOther.trim())
      e.fieldOfStudyOther = "Please specify your field";
  }
  if (step === 2) {
    if (!data.battingStyle)  e.battingStyle  = "Please select one";
    if (!data.bowlingStyle)  e.bowlingStyle  = "Please select one";
    if (!data.referenceName.trim()) e.referenceName = "Reference name is required";
  }
  if (step === 3) {
    if (!data.sabhaLike) e.sabhaLike = "Please select one";
    if (data.sabhaLike === "Other" && !data.sabhaLikeOther.trim())
      e.sabhaLikeOther = "Please specify";
  }
  return e;
}

/* ─── Atoms ───────────────────────────────────────────────────────────────── */

function FieldLabel({
  children,
  required,
  hint,
}: {
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/45">
        {children}
        {required && <span className="ml-1.5 text-apl-yellow">✦</span>}
      </span>
      {hint && (
        <span className="font-mono text-[8px] tracking-[0.5px] text-white/25">{hint}</span>
      )}
    </div>
  );
}

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.5px] text-apl-red">
      <span>✕</span>
      {msg}
    </p>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="mb-6">
      <FieldLabel required={required} hint={hint}>
        {label}
      </FieldLabel>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border bg-[#0d0d0d] px-4 py-[15px] font-sans text-[17px] text-white outline-none transition-all placeholder:text-white/20 ${
          error
            ? "border-apl-red/50 bg-apl-red/5 focus:border-apl-red/70"
            : "border-white/[0.09] focus:border-apl-yellow focus:bg-[#111]"
        }`}
      />
      <FieldErr msg={error} />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="mb-6">
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className={`w-full resize-none border bg-[#0d0d0d] px-4 py-[15px] font-sans text-[17px] text-white outline-none transition-all placeholder:text-white/20 ${
          error
            ? "border-apl-red/50 bg-apl-red/5"
            : "border-white/[0.09] focus:border-apl-yellow focus:bg-[#111]"
        }`}
      />
      <FieldErr msg={error} />
    </div>
  );
}

/* ─── Option tile grid ────────────────────────────────────────────────────── */

function TileButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
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

function OptionGrid({
  label,
  options,
  value,
  onChange,
  cols = 2,
  required,
  error,
  hint,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="mb-6">
      <FieldLabel required={required} hint={hint}>
        {label}
      </FieldLabel>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(options.length, cols)}, 1fr)` }}
      >
        {options.map((o) => (
          <TileButton key={o} label={o} selected={value === o} onClick={() => onChange(o)} />
        ))}
      </div>
      <FieldErr msg={error} />
    </div>
  );
}

function OptionGridWithOther({
  label,
  options,
  value,
  otherValue,
  onChange,
  onOtherChange,
  cols = 2,
  required,
  error,
  otherError,
}: {
  label: string;
  options: readonly string[];
  value: string;
  otherValue: string;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
  cols?: number;
  required?: boolean;
  error?: string;
  otherError?: string;
}) {
  return (
    <div className="mb-6">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(options.length, cols)}, 1fr)` }}
      >
        {options.map((o) => (
          <TileButton key={o} label={o} selected={value === o} onClick={() => onChange(o)} />
        ))}
      </div>
      {value === "Other" && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Please specify…"
          autoFocus
          className={`mt-2 w-full border bg-[#0d0d0d] px-4 py-[15px] font-sans text-[17px] text-white outline-none transition-all placeholder:text-white/20 ${
            otherError
              ? "border-apl-red/50 bg-apl-red/5"
              : "border-white/[0.09] focus:border-apl-yellow"
          }`}
        />
      )}
      <FieldErr msg={error ?? otherError} />
    </div>
  );
}

/* ─── Step indicator ──────────────────────────────────────────────────────── */

function StepperBar({ current }: { current: number }) {
  return (
    <div className="px-6 py-5 md:px-12">
      <div className="relative flex items-start justify-between">
        {/* Connecting track — runs between the centres of the outer circles */}
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
              {/* Circle */}
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
              {/* Label — hidden on xs */}
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

/* ─── Step header ─────────────────────────────────────────────────────────── */

function StepHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
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

/* ─── Image upload ────────────────────────────────────────────────────────── */

function ImageDropZone({ onAdd }: { onAdd: (files: FileList) => void }) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files.length) onAdd(e.dataTransfer.files);
      }}
      onClick={() => ref.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
      className={`cursor-pointer border-2 border-dashed py-16 text-center transition-all duration-200 ${
        over
          ? "border-apl-yellow bg-apl-yellow/5"
          : "border-white/[0.10] hover:border-white/22 hover:bg-white/[0.02]"
      }`}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => { if (e.target.files) onAdd(e.target.files); e.target.value = ""; }}
      />
      <span className="block font-anton text-[56px] leading-none text-white/12">↑</span>
      <p className="mt-4 font-mono text-[11px] tracking-[2.5px] text-white/45">
        DRAG &amp; DROP OR CLICK TO BROWSE
      </p>
      <p className="mt-1.5 font-mono text-[9px] tracking-[1.5px] text-white/25">
        JPG · PNG · WEBP · MAX 5 MB EACH
      </p>
    </div>
  );
}

async function downloadImage(url: string, filename: string) {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank");
  }
}

function UploadCard({
  item,
  onRemove,
}: {
  item: UploadItem;
  onRemove: () => void;
}) {
  return (
    <div className="group relative overflow-hidden border border-white/[0.07]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.localUrl}
        alt={item.file.name}
        className="aspect-square w-full object-cover"
      />

      {item.uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-apl-ink/82">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-apl-yellow" />
          <span className="font-mono text-[7px] tracking-[1.5px] text-apl-yellow">UPLOADING</span>
        </div>
      )}

      {item.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-apl-red/20 p-2">
          <span className="text-center font-mono text-[7px] leading-snug text-white">
            {item.error}
          </span>
        </div>
      )}

      {item.storageUrl && !item.uploading && (
        <span className="absolute left-2 top-2 bg-apl-yellow px-1.5 py-[2px] font-mono text-[7px] tracking-[1px] text-apl-ink">
          ✓
        </span>
      )}

      {/* Hover controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-apl-ink/90 px-2 py-1.5 opacity-0 transition group-hover:opacity-100">
        <span className="min-w-0 truncate font-mono text-[7px] text-white/40">
          {item.file.name}
        </span>
        <div className="ml-1 flex shrink-0 gap-1">
          {item.storageUrl && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); downloadImage(item.storageUrl!, item.file.name); }}
              className="border border-apl-yellow/40 px-1.5 py-0.5 font-mono text-[7px] text-apl-yellow hover:bg-apl-yellow/10"
            >
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="border border-white/20 px-1.5 py-0.5 font-mono text-[7px] text-white/50 hover:border-apl-red/50 hover:text-apl-red"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Success screen ──────────────────────────────────────────────────────── */

function SuccessScreen({ phone, uploads }: { phone: string; uploads: UploadItem[] }) {
  const saved = uploads.filter((u) => u.storageUrl);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-apl-page px-6 py-20 text-white">
      <div
        className="mb-10 grid h-28 w-28 animate-apl-pop place-items-center rounded-full bg-apl-yellow"
        style={{
          boxShadow:
            "0 0 0 5px var(--apl-ink), 0 0 0 7px var(--apl-yellow), 0 0 90px rgba(255,195,31,0.4)",
        }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
          <path
            d="M14 28l10 10 18-20"
            stroke="#0a0a0a"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="mb-3 font-mono text-[11px] tracking-[3px] text-apl-yellow">// YOU&apos;RE IN</p>
      <h1 className="text-center font-anton text-[60px] uppercase leading-[0.82] md:text-[88px]">
        WELCOME TO
        <br />
        <span className="text-apl-yellow">SEASON 3.</span>
      </h1>
      <p className="mt-6 max-w-[360px] text-center font-sans text-[15px] leading-[1.7] text-white/55">
        Confirmation sent to{" "}
        <strong className="font-sans text-white">{phone}</strong>. See you at{" "}
        <strong className="font-sans text-apl-yellow">Akshar Arena</strong>.
      </p>

      <div className="mt-10 grid w-full max-w-[440px] grid-cols-2 gap-2">
        <div className="border border-white/[0.07] bg-apl-surface py-6 text-center">
          <p className="font-anton text-[30px] leading-none text-apl-yellow">
            {APL_SEASON.opening}
          </p>
          <p className="mt-1.5 font-mono text-[8px] tracking-[2px] text-white/35">OPENING DAY</p>
        </div>
        <div className="border border-white/[0.07] bg-apl-surface py-6 text-center">
          <p className="font-anton text-[30px] leading-none text-apl-yellow">#APL3</p>
          <p className="mt-1.5 font-mono text-[8px] tracking-[2px] text-white/35">YOUR HASHTAG</p>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="mt-8 w-full max-w-[440px]">
          <p className="mb-3 font-mono text-[9px] tracking-[2px] text-white/30">
            YOUR UPLOADED PHOTOS
          </p>
          <div className="grid grid-cols-4 gap-[3px]">
            {saved.map((u) => (
              <div key={u.id} className="group relative cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.localUrl} alt="" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => downloadImage(u.storageUrl!, u.file.name)}
                  className="absolute inset-0 flex items-center justify-center bg-apl-ink/0 font-mono text-[11px] text-transparent transition group-hover:bg-apl-ink/70 group-hover:text-apl-yellow"
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
          {saved.length > 1 && (
            <button
              type="button"
              onClick={() =>
                saved.forEach((u) => downloadImage(u.storageUrl!, u.file.name))
              }
              className="mt-2 w-full border border-white/[0.09] py-3 font-mono text-[9px] tracking-[2px] text-white/40 transition hover:border-white/25 hover:text-white"
            >
              ↓ DOWNLOAD ALL
            </button>
          )}
        </div>
      )}

      <Link
        href="/"
        className="mt-10 border border-white/20 px-10 py-4 font-mono text-[11px] tracking-[2.5px] text-white transition hover:border-white/40"
      >
        ← BACK TO HOME
      </Link>
    </div>
  );
}

/* ─── Initial state & constants ───────────────────────────────────────────── */

const INITIAL: FormData = {
  fullName: "",       phone: "",
  fieldOfStudy: "",   fieldOfStudyOther: "",
  battingStyle: "",   bowlingStyle: "",
  referenceName: "",
  sabhaLike: "",      sabhaLikeOther: "",
  otherTopics: "",    imageUrls: [],
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/* ─── Main ────────────────────────────────────────────────────────────────── */

export default function RegisterForm() {
  const [step,      setStep]      = useState(1);
  const [data,      setData]      = useState<FormData>(INITIAL);
  const [errors,    setErrors]    = useState<FieldErrors>({});
  const [uploads,   setUploads]   = useState<UploadItem[]>([]);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  /* ── Field helpers ─────────────────────────────────────────────────────── */

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((d) => ({ ...d, [key]: e.target.value }));

  const pick = (key: keyof FormData) => (v: string) => {
    setData((d) => ({ ...d, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ── Image handlers ────────────────────────────────────────────────────── */

  const handleAddImages = useCallback((files: FileList) => {
    const valid = Array.from(files).filter((f) => {
      if (f.size > MAX_SIZE) {
        setUploadErr(`"${f.name}" exceeds 5 MB.`);
        return false;
      }
      return true;
    });
    if (!valid.length) return;
    setUploadErr(null);

    const items: UploadItem[] = valid.map((file) => ({
      id:         `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      localUrl:   URL.createObjectURL(file),
      storageUrl: null,
      uploading:  true,
      error:      null,
    }));

    setUploads((p) => [...p, ...items]);

    items.forEach(async (item) => {
      const path = `registrations/${Date.now()}-${item.id}/${item.file.name}`;
      try {
        const url = await uploadImage(item.file, path);
        setUploads((p) =>
          p.map((u) => (u.id === item.id ? { ...u, uploading: false, storageUrl: url } : u)),
        );
        setData((d) => ({ ...d, imageUrls: [...d.imageUrls, url] }));
      } catch (err) {
        setUploads((p) =>
          p.map((u) =>
            u.id === item.id ? { ...u, uploading: false, error: (err as Error).message } : u,
          ),
        );
      }
    });
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setUploads((prev) => {
      const item = prev.find((u) => u.id === id);
      if (item) {
        URL.revokeObjectURL(item.localUrl);
        if (item.storageUrl)
          setData((d) => ({
            ...d,
            imageUrls: d.imageUrls.filter((u) => u !== item.storageUrl),
          }));
      }
      return prev.filter((u) => u.id !== id);
    });
  }, []);

  /* ── Navigation ────────────────────────────────────────────────────────── */

  const handleNext = async () => {
    /* Steps 1–3: validate then advance */
    if (step < 4) {
      const errs = validateStep(step, data);
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep((s) => s + 1);
      return;
    }

    /* Step 4: submit */
    if (uploads.some((u) => u.uploading)) return;

    setLoading(true);
    setErrors({});

    let res: Response;
    try {
      res = await fetch("/api/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:      data.fullName,
          phone:         data.phone,
          fieldOfStudy:  data.fieldOfStudy === "Other" ? data.fieldOfStudyOther : data.fieldOfStudy,
          battingStyle:  data.battingStyle,
          bowlingStyle:  data.bowlingStyle,
          referenceName: data.referenceName,
          sabhaLike:     data.sabhaLike === "Other" ? data.sabhaLikeOther : data.sabhaLike,
          otherTopics:   data.otherTopics || undefined,
          imageUrls:     data.imageUrls,
        }),
      });
    } catch {
      setLoading(false);
      setErrors({ _server: "Network error — check your connection and try again." });
      return;
    }

    setLoading(false);

    if (!res.ok) {
      const payload = await res.json().catch(() => ({ error: "Unknown server error." }));
      setErrors({ _server: payload.error ?? "Registration failed. Please try again." });
      return;
    }

    setSuccess(true);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

  /* ── Derived ───────────────────────────────────────────────────────────── */

  if (success) return <SuccessScreen phone={data.phone} uploads={uploads} />;

  const isLastStep   = step === 4;
  const anyUploading = uploads.some((u) => u.uploading);

  const ctaLabel = loading
    ? "SUBMITTING…"
    : isLastStep && anyUploading
    ? "UPLOADING…"
    : isLastStep
    ? "SUBMIT REGISTRATION →"
    : "CONTINUE →";

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <div className="flex min-h-screen flex-col bg-apl-ink text-white">

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.06] px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-[680px] items-center justify-between">
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[2.5px] text-white/40 transition hover:text-white"
          >
            ← HOME
          </Link>
          <span className="font-mono text-[10px] tracking-[2.5px] text-white/20">
            APL · S3 · REGISTER
          </span>
        </div>
      </header>

      {/* ── Step indicator ───────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[680px]">
          <StepperBar current={step} />
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto scrollbar-none">
        <div className="mx-auto max-w-[680px] px-6 pb-36 pt-10 md:px-12 md:pt-12">

          {/* Animate content on step change */}
          <div key={step} className="animate-step-in">

            {/* ── Step 1 — Personal info ───────────────────────────────── */}
            {step === 1 && (
              <>
                <StepHeader
                  eyebrow="// STEP 01 OF 04"
                  title={<>Who are <span className="text-apl-yellow">you?</span></>}
                  sub="Tell us who you are so we can set up your registration."
                />
                <FormInput
                  label="Full Name"
                  value={data.fullName}
                  onChange={set("fullName")}
                  placeholder="e.g. Aarav Patel"
                  required
                  error={errors.fullName}
                />
                <FormInput
                  label="Phone Number"
                  value={data.phone}
                  onChange={set("phone")}
                  placeholder="+91 98765 43210"
                  type="tel"
                  required
                  hint="Indian 10-digit"
                  error={errors.phone}
                />
                <OptionGridWithOther
                  label="Field of Study"
                  options={FIELD_OF_STUDY_OPTIONS}
                  value={data.fieldOfStudy}
                  otherValue={data.fieldOfStudyOther}
                  onChange={pick("fieldOfStudy")}
                  onOtherChange={(v) => setData((d) => ({ ...d, fieldOfStudyOther: v }))}
                  cols={2}
                  required
                  error={errors.fieldOfStudy}
                  otherError={errors.fieldOfStudyOther}
                />
              </>
            )}

            {/* ── Step 2 — Cricket profile ─────────────────────────────── */}
            {step === 2 && (
              <>
                <StepHeader
                  eyebrow="// STEP 02 OF 04"
                  title={<>Cricket <span className="text-apl-yellow">profile.</span></>}
                  sub="Tell us how you play the game and who referred you."
                />
                <OptionGrid
                  label="Batting Style"
                  options={BATTING_STYLES}
                  value={data.battingStyle}
                  onChange={pick("battingStyle")}
                  cols={2}
                  required
                  error={errors.battingStyle}
                />
                <OptionGrid
                  label="Bowling Style"
                  options={BOWLING_STYLES}
                  value={data.bowlingStyle}
                  onChange={pick("bowlingStyle")}
                  cols={2}
                  required
                  error={errors.bowlingStyle}
                />
                <FormInput
                  label="Reference Name (Follow Up Sevak)"
                  value={data.referenceName}
                  onChange={set("referenceName")}
                  placeholder="e.g. Harshil Soni"
                  required
                  error={errors.referenceName}
                />
              </>
            )}

            {/* ── Step 3 — Sabha preferences ───────────────────────────── */}
            {step === 3 && (
              <>
                <StepHeader
                  eyebrow="// STEP 03 OF 04"
                  title={<>Your <span className="text-apl-yellow">Sabha.</span></>}
                  sub="Help us understand what matters most to you in Sabha."
                />
                <OptionGridWithOther
                  label="What do you like most in Sabha?"
                  options={SABHA_LIKES}
                  value={data.sabhaLike}
                  otherValue={data.sabhaLikeOther}
                  onChange={pick("sabhaLike")}
                  onOtherChange={(v) => setData((d) => ({ ...d, sabhaLikeOther: v }))}
                  cols={1}
                  required
                  error={errors.sabhaLike}
                  otherError={errors.sabhaLikeOther}
                />
                <FormTextarea
                  label="Other Topics You Expect Us to Cover"
                  value={data.otherTopics}
                  onChange={set("otherTopics")}
                  placeholder="e.g. Physical Health, Finance, Career Guidance"
                />
              </>
            )}

            {/* ── Step 4 — Photos + submit ─────────────────────────────── */}
            {step === 4 && (
              <>
                <StepHeader
                  eyebrow="// STEP 04 OF 04"
                  title={<>Upload <span className="text-apl-yellow">photos.</span></>}
                  sub="Optional — images are stored securely and will be analysed by an AI model in a future update."
                />

                <ImageDropZone onAdd={handleAddImages} />

                {uploadErr && (
                  <p className="mt-3 font-mono text-[9px] text-apl-red">{uploadErr}</p>
                )}

                {uploads.length > 0 && (
                  <>
                    <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4">
                      {uploads.map((item) => (
                        <UploadCard
                          key={item.id}
                          item={item}
                          onRemove={() => handleRemoveImage(item.id)}
                        />
                      ))}
                    </div>
                    {uploads.some((u) => u.storageUrl) && (
                      <button
                        type="button"
                        onClick={() =>
                          uploads
                            .filter((u) => u.storageUrl)
                            .forEach((u) => downloadImage(u.storageUrl!, u.file.name))
                        }
                        className="mt-3 w-full border border-white/[0.09] py-3 font-mono text-[9px] tracking-[2px] text-white/40 transition hover:border-white/25 hover:text-white"
                      >
                        ↓ DOWNLOAD ALL UPLOADED IMAGES
                      </button>
                    )}
                  </>
                )}

                {/* Server / submit error */}
                {errors._server && (
                  <div className="mt-6 border border-apl-red/30 bg-apl-red/10 px-5 py-4 font-mono text-[10px] tracking-[0.5px] text-apl-red">
                    ✕ {errors._server}
                  </div>
                )}
              </>
            )}

          </div>{/* /animate-step-in */}
        </div>
      </div>

      {/* ── Fixed bottom navigation ──────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-white/[0.05] px-6 pb-8 pt-5 md:px-12"
        style={{ background: "linear-gradient(to top, var(--apl-ink) 65%, rgba(10,10,10,0.94))" }}
      >
        <div className="mx-auto flex max-w-[680px] items-center gap-3">

          {/* Back / Home */}
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="shrink-0 border border-white/[0.12] px-6 py-[15px] font-mono text-[10px] tracking-[1.5px] text-white/55 transition hover:border-white/30 hover:text-white"
            >
              ← BACK
            </button>
          ) : (
            <Link
              href="/"
              className="shrink-0 border border-white/[0.12] px-6 py-[15px] font-mono text-[10px] tracking-[1.5px] text-white/55 transition hover:border-white/30 hover:text-white"
            >
              ← HOME
            </Link>
          )}

          {/* Continue / Submit */}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading || (isLastStep && anyUploading)}
            className="shimmer relative flex-1 overflow-hidden bg-apl-yellow py-[15px] font-anton text-[17px] tracking-[2px] text-apl-ink transition-transform hover:-translate-y-[1px] active:scale-[0.99] disabled:opacity-55 md:text-[19px]"
          >
            {ctaLabel}
          </button>

        </div>

        {/* Step fraction hint */}
        <p className="mt-3 text-center font-mono text-[8px] tracking-[2px] text-white/20">
          {step} / {STEPS.length} COMPLETED
        </p>
      </div>

    </div>
  );
}

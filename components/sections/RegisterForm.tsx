"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { getSupabase, uploadImage } from "@/lib/supabase";
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

/* ─── Validation ──────────────────────────────────────────────────────────── */

function validate(data: FormData): FieldErrors {
  const e: FieldErrors = {};
  if (!data.fullName.trim()) e.fullName = "Full name is required";
  const stripped = data.phone.replace(/[\s\-()+]/g, "");
  if (!/^(91|0)?[6-9]\d{9}$/.test(stripped))
    e.phone = "Enter a valid 10-digit Indian mobile number";
  if (!data.fieldOfStudy) e.fieldOfStudy = "Select your field of study";
  if (data.fieldOfStudy === "Other" && !data.fieldOfStudyOther.trim())
    e.fieldOfStudyOther = "Please specify";
  if (!data.battingStyle) e.battingStyle = "Select batting style";
  if (!data.bowlingStyle) e.bowlingStyle = "Select bowling style";
  if (!data.referenceName.trim()) e.referenceName = "Reference name is required";
  if (!data.sabhaLike) e.sabhaLike = "Select what you like most";
  if (data.sabhaLike === "Other" && !data.sabhaLikeOther.trim())
    e.sabhaLikeOther = "Please specify";
  return e;
}

/* map each section's anchor-id to the field keys it owns */
const SECTION_MAP: [string, (keyof FormData)[]][] = [
  ["s1", ["fullName", "phone"]],
  ["s2", ["fieldOfStudy", "fieldOfStudyOther"]],
  ["s3", ["battingStyle", "bowlingStyle"]],
  ["s4", ["referenceName", "sabhaLike", "sabhaLikeOther"]],
];

/* ─── Atomic UI ───────────────────────────────────────────────────────────── */

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-2 font-mono text-[10px] tracking-[1px] text-apl-red">{msg}</p>
  );
}

function InputLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-[2.5px] text-white/40">
      {children}
      {required && (
        <span className="ml-1.5 font-sans text-[13px] text-apl-yellow leading-none">✦</span>
      )}
    </p>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="mb-10">
      <label>
        <InputLabel required={required}>{label}</InputLabel>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border-b bg-transparent pb-4 pt-1 font-sans text-[20px] leading-snug text-white outline-none transition-colors placeholder:text-white/20 md:text-[22px] ${
            error
              ? "border-apl-red"
              : "border-white/[0.12] focus:border-apl-yellow"
          }`}
        />
      </label>
      <ErrMsg msg={error} />
    </div>
  );
}

function TextArea({
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
    <div className="mb-10">
      <label>
        <InputLabel required={required}>{label}</InputLabel>
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={`w-full resize-none border-b bg-transparent pb-4 pt-1 font-sans text-[20px] leading-snug text-white outline-none transition-colors placeholder:text-white/20 md:text-[22px] ${
            error
              ? "border-apl-red"
              : "border-white/[0.12] focus:border-apl-yellow"
          }`}
        />
      </label>
      <ErrMsg msg={error} />
    </div>
  );
}

/* ─── Option tiles ────────────────────────────────────────────────────────── */

function OptionGrid({
  options,
  value,
  onChange,
  cols = 2,
  error,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
  error?: string;
}) {
  return (
    <div className="mb-10">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(options.length, cols)}, 1fr)` }}
      >
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`border px-5 py-5 text-left font-anton text-[16px] uppercase tracking-[1.5px] transition-all duration-150 active:scale-[0.97] md:text-[18px] ${
              value === o
                ? "border-apl-yellow bg-apl-yellow text-apl-ink"
                : "border-white/[0.09] bg-[#111111] text-white hover:border-apl-yellow/50 hover:bg-[#171717]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <ErrMsg msg={error} />
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
    <div className="mb-10">
      <InputLabel required={required}>{label}</InputLabel>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(options.length, cols)}, 1fr)` }}
      >
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`border px-5 py-5 text-left font-anton text-[16px] uppercase tracking-[1.5px] transition-all duration-150 active:scale-[0.97] md:text-[18px] ${
              value === o
                ? "border-apl-yellow bg-apl-yellow text-apl-ink"
                : "border-white/[0.09] bg-[#111111] text-white hover:border-apl-yellow/50 hover:bg-[#171717]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {value === "Other" && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Please specify…"
          className={`mt-3 w-full border-b bg-transparent pb-4 pt-1 font-sans text-[20px] text-white outline-none transition-colors placeholder:text-white/20 ${
            otherError ? "border-apl-red" : "border-white/[0.12] focus:border-apl-yellow"
          }`}
        />
      )}
      <ErrMsg msg={error ?? otherError} />
    </div>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────────────────── */

function FormSection({
  id,
  num,
  tag,
  title,
  children,
}: {
  id: string;
  num: string;
  tag: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-white/[0.06] pt-16 md:pt-24">
      {/* Eyebrow */}
      <div className="mb-6 flex items-center gap-4">
        <span className="shrink-0 font-mono text-[11px] tracking-[2.5px] text-apl-red">
          {num}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[2px] text-white/25">{tag}</span>
        <div className="flex-1 border-t border-white/[0.05]" />
      </div>

      {/* Section title */}
      <h2 className="mb-12 font-anton text-[58px] uppercase leading-[0.84] md:text-[88px]">
        {title}
      </h2>

      {children}
    </section>
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
      className={`cursor-pointer border border-dashed py-16 text-center transition-all duration-200 ${
        over
          ? "border-apl-yellow bg-apl-yellow/5"
          : "border-white/[0.12] hover:border-white/25"
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
      <span className="block font-anton text-[48px] leading-none text-white/15">↑</span>
      <p className="mt-4 font-mono text-[12px] tracking-[2.5px] text-white/45">
        DRAG &amp; DROP OR CLICK TO BROWSE
      </p>
      <p className="mt-2 font-mono text-[9px] tracking-[2px] text-white/25">
        JPG · PNG · WEBP · MAX 5 MB EACH
      </p>
    </div>
  );
}

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank");
  }
}

function UploadCard({ item, onRemove }: { item: UploadItem; onRemove: () => void }) {
  return (
    <div className="group relative overflow-hidden border border-white/[0.07]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.localUrl}
        alt={item.file.name}
        className="aspect-square w-full object-cover"
      />

      {/* Uploading overlay */}
      {item.uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-apl-ink/80">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-apl-yellow" />
          <span className="font-mono text-[8px] tracking-[1.5px] text-apl-yellow">UPLOADING</span>
        </div>
      )}

      {/* Error overlay */}
      {item.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-apl-red/20 p-3">
          <span className="text-center font-mono text-[8px] leading-relaxed text-white">
            {item.error}
          </span>
        </div>
      )}

      {/* Saved badge */}
      {item.storageUrl && !item.uploading && (
        <span className="absolute left-2 top-2 bg-apl-yellow px-1.5 py-[3px] font-mono text-[7px] tracking-[1px] text-apl-ink">
          ✓ SAVED
        </span>
      )}

      {/* Hover action bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-apl-ink/90 px-2 py-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="min-w-0 truncate font-mono text-[7px] text-white/40">
          {item.file.name}
        </span>
        <div className="ml-1 flex shrink-0 gap-1">
          {item.storageUrl && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); downloadImage(item.storageUrl!, item.file.name); }}
              className="border border-apl-yellow/40 px-1.5 py-0.5 font-mono text-[8px] text-apl-yellow hover:bg-apl-yellow/10"
            >
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="border border-white/20 px-1.5 py-0.5 font-mono text-[8px] text-white/50 hover:border-apl-red/50 hover:text-apl-red"
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
      {/* Glow ring */}
      <div
        className="mb-10 grid h-28 w-28 place-items-center rounded-full bg-apl-yellow animate-apl-pop"
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

      <p className="mb-3 font-mono text-[11px] tracking-[3px] text-apl-yellow">
        // YOU&apos;RE IN
      </p>
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

      {/* Stat cards */}
      <div className="mt-10 grid w-full max-w-[440px] grid-cols-2 gap-2">
        <div className="border border-white/[0.07] bg-apl-surface py-6 text-center">
          <p className="font-anton text-[30px] leading-none text-apl-yellow">{APL_SEASON.opening}</p>
          <p className="mt-1.5 font-mono text-[8px] tracking-[2px] text-white/35">OPENING DAY</p>
        </div>
        <div className="border border-white/[0.07] bg-apl-surface py-6 text-center">
          <p className="font-anton text-[30px] leading-none text-apl-yellow">#APL3</p>
          <p className="mt-1.5 font-mono text-[8px] tracking-[2px] text-white/35">YOUR HASHTAG</p>
        </div>
      </div>

      {/* Uploaded photos */}
      {saved.length > 0 && (
        <div className="mt-10 w-full max-w-[440px]">
          <p className="mb-3 font-mono text-[9px] tracking-[2px] text-white/30">
            YOUR UPLOADED PHOTOS
          </p>
          <div className="grid grid-cols-4 gap-[3px]">
            {saved.map((u) => (
              <div key={u.id} className="group relative cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.localUrl}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
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
              onClick={() => saved.forEach((u) => downloadImage(u.storageUrl!, u.file.name))}
              className="mt-2 w-full border border-white/[0.10] py-3 font-mono text-[9px] tracking-[2px] text-white/45 transition hover:border-white/25 hover:text-white"
            >
              ↓ DOWNLOAD ALL
            </button>
          )}
        </div>
      )}

      <Link
        href="/"
        className="mt-12 border border-white/20 px-10 py-4 font-mono text-[11px] tracking-[2.5px] text-white transition hover:border-white/40"
      >
        ← BACK TO HOME
      </Link>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

const INITIAL: FormData = {
  fullName: "",
  phone: "",
  fieldOfStudy: "",
  fieldOfStudyOther: "",
  battingStyle: "",
  bowlingStyle: "",
  referenceName: "",
  sabhaLike: "",
  sabhaLikeOther: "",
  otherTopics: "",
  imageUrls: [],
};

const MAX_SIZE = 5 * 1024 * 1024;

export default function RegisterForm() {
  const [data, setData]           = useState<FormData>(INITIAL);
  const [errors, setErrors]       = useState<FieldErrors>({});
  const [uploads, setUploads]     = useState<UploadItem[]>([]);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  /* ── field helpers ─────────────────────────────────────────────────────── */

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((d) => ({ ...d, [key]: e.target.value }));

  const pick = (key: keyof FormData) => (v: string) => {
    setData((d) => ({ ...d, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ── image handlers ────────────────────────────────────────────────────── */

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
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      localUrl: URL.createObjectURL(file),
      storageUrl: null,
      uploading: true,
      error: null,
    }));

    setUploads((prev) => [...prev, ...items]);

    items.forEach(async (item) => {
      const path = `registrations/${Date.now()}-${item.id}/${item.file.name}`;
      try {
        const url = await uploadImage(item.file, path);
        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, uploading: false, storageUrl: url } : u)),
        );
        setData((d) => ({ ...d, imageUrls: [...d.imageUrls, url] }));
      } catch (err) {
        setUploads((prev) =>
          prev.map((u) =>
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
          setData((d) => ({ ...d, imageUrls: d.imageUrls.filter((u) => u !== item.storageUrl) }));
      }
      return prev.filter((u) => u.id !== id);
    });
  }, []);

  /* ── submit ────────────────────────────────────────────────────────────── */

  const handleSubmit = async () => {
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      // scroll to the first section that owns an error
      for (const [id, fields] of SECTION_MAP) {
        if (fields.some((f) => errs[f])) {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        }
      }
      return;
    }

    if (uploads.some((u) => u.uploading)) return;

    setLoading(true);
    setErrors({});

    const { error } = await getSupabase()
      .from("registrations")
      .insert({
        full_name:      data.fullName,
        phone:          data.phone,
        field_of_study: data.fieldOfStudy === "Other" ? data.fieldOfStudyOther : data.fieldOfStudy,
        batting_style:  data.battingStyle,
        bowling_style:  data.bowlingStyle,
        reference_name: data.referenceName,
        sabha_like:     data.sabhaLike === "Other" ? data.sabhaLikeOther : data.sabhaLike,
        other_topics:   data.otherTopics || null,
        image_urls:     data.imageUrls,
      });

    setLoading(false);

    if (error) {
      setErrors({ _server: error.message });
      return;
    }
    setSuccess(true);
  };

  /* ── render ────────────────────────────────────────────────────────────── */

  if (success) return <SuccessScreen phone={data.phone} uploads={uploads} />;

  const anyUploading = uploads.some((u) => u.uploading);

  return (
    <div className="flex min-h-screen flex-col bg-apl-ink text-white">

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.06] px-5 py-5 md:px-12">
        <div className="mx-auto flex max-w-[820px] items-center justify-between">
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

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Yellow glow top-left */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-apl-yellow/10 blur-[100px]" />

        <div className="relative mx-auto max-w-[820px] px-5 pb-16 pt-14 md:px-12 md:pb-20 md:pt-20">
          <p className="mb-6 font-mono text-[11px] tracking-[3.5px] text-apl-yellow">
            // AKSHAR PREMIER LEAGUE · SEASON 3
          </p>
          <h1 className="font-anton uppercase leading-[0.82]">
            <span className="block text-[76px] md:text-[118px]">REGISTER</span>
            {/* Outlined — gives the "magazine editorial" depth */}
            <span className="block text-[76px] text-stroke-yellow md:text-[118px]">FOR THE</span>
            <span className="block text-[76px] text-apl-yellow md:text-[118px]">LEAGUE.</span>
          </h1>

          <p className="mt-8 max-w-[400px] font-sans text-[15px] leading-[1.75] text-white/45">
            Fill in the details below and hit submit. One form, no steps, no nonsense.
          </p>
        </div>
      </div>

      {/* ── Form body ───────────────────────────────────────────────────── */}
      <div className="flex-1">
        <div className="mx-auto max-w-[820px] px-5 pb-44 md:px-12">

          {/* ── Section 1: Personal ──────────────────────────────────── */}
          <FormSection
            id="s1"
            num="// 01"
            tag="WHO ARE YOU"
            title={
              <>
                Tell us about
                <br />
                <span className="text-apl-yellow">yourself.</span>
              </>
            }
          >
            <TextInput
              label="Full Name"
              value={data.fullName}
              onChange={set("fullName")}
              placeholder="e.g. Aarav Patel"
              required
              error={errors.fullName}
            />
            <TextInput
              label="Phone Number"
              value={data.phone}
              onChange={set("phone")}
              placeholder="+91 98765 43210"
              type="tel"
              required
              error={errors.phone}
            />
          </FormSection>

          {/* ── Section 2: Studies ───────────────────────────────────── */}
          <FormSection
            id="s2"
            num="// 02"
            tag="YOUR STUDIES"
            title={
              <>
                What do you
                <br />
                <span className="text-apl-yellow">study?</span>
              </>
            }
          >
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
          </FormSection>

          {/* ── Section 3: Cricket ───────────────────────────────────── */}
          <FormSection
            id="s3"
            num="// 03"
            tag="YOUR CRICKET"
            title={
              <>
                How do you
                <br />
                <span className="text-apl-yellow">play?</span>
              </>
            }
          >
            {/* Side-by-side on desktop */}
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <InputLabel required>Batting Style</InputLabel>
                <OptionGrid
                  options={BATTING_STYLES}
                  value={data.battingStyle}
                  onChange={pick("battingStyle")}
                  cols={2}
                  error={errors.battingStyle}
                />
              </div>
              <div>
                <InputLabel required>Bowling Style</InputLabel>
                <OptionGrid
                  options={BOWLING_STYLES}
                  value={data.bowlingStyle}
                  onChange={pick("bowlingStyle")}
                  cols={2}
                  error={errors.bowlingStyle}
                />
              </div>
            </div>
          </FormSection>

          {/* ── Section 4: Sabha ─────────────────────────────────────── */}
          <FormSection
            id="s4"
            num="// 04"
            tag="YOUR SABHA"
            title={
              <>
                About your
                <br />
                <span className="text-apl-yellow">Sabha.</span>
              </>
            }
          >
            <TextInput
              label="Reference Name (Follow Up Sevak)"
              value={data.referenceName}
              onChange={set("referenceName")}
              placeholder="e.g. Harshil Soni"
              required
              error={errors.referenceName}
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
            <TextArea
              label="Other topics you expect us to cover"
              value={data.otherTopics}
              onChange={set("otherTopics")}
              placeholder="e.g. Physical Health, Finance, Career Guidance"
            />
          </FormSection>

          {/* ── Section 5: Photos ────────────────────────────────────── */}
          <FormSection
            id="s5"
            num="// 05"
            tag="YOUR PHOTOS"
            title={
              <>
                Upload
                <br />
                <span className="text-apl-yellow">images.</span>
              </>
            }
          >
            <p className="mb-8 font-sans text-[15px] leading-[1.7] text-white/40">
              Optional &mdash; stored securely. A future AI model will analyse and transform your
              uploaded images.
            </p>

            <ImageDropZone onAdd={handleAddImages} />

            {uploadErr && (
              <p className="mt-3 font-mono text-[10px] text-apl-red">{uploadErr}</p>
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
          </FormSection>

          {/* Server error */}
          {errors._server && (
            <div className="mt-6 border border-apl-red/30 bg-apl-red/10 px-5 py-4 font-mono text-[10px] tracking-[0.5px] text-apl-red">
              ✕ {errors._server}
            </div>
          )}

          {/* Validation summary (visible on mobile where user may scroll past errors) */}
          {Object.keys(errors).filter((k) => k !== "_server").length > 0 && (
            <p className="mt-4 font-mono text-[10px] tracking-[0.5px] text-apl-red/70">
              ↑ Please fix the highlighted fields above before submitting.
            </p>
          )}

        </div>
      </div>

      {/* ── Sticky submit CTA ───────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-8 md:px-12"
        style={{ background: "linear-gradient(to top, var(--apl-ink) 55%, transparent)" }}
      >
        <div className="mx-auto max-w-[820px]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || anyUploading}
            className="shimmer relative w-full overflow-hidden bg-apl-yellow py-5 font-anton text-[20px] tracking-[2.5px] text-apl-ink transition-transform hover:-translate-y-[2px] active:scale-[0.99] disabled:opacity-55 md:py-6 md:text-[24px]"
          >
            {loading
              ? "SUBMITTING…"
              : anyUploading
              ? "UPLOADING IMAGES…"
              : "SUBMIT REGISTRATION →"}
          </button>
        </div>
      </div>

    </div>
  );
}

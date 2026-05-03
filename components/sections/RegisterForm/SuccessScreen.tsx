"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { APL_SEASON } from "@/lib/constants";
import type { UploadItem } from "./types";

/* ─── Avatar state machine ────────────────────────────────────────────────── */

type AvatarState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready";  src: string }
  | { status: "error";  message: string };

/* ─── SuccessScreen ───────────────────────────────────────────────────────── */

export function SuccessScreen({
  phone,
  uploads,
}: {
  phone:   string;
  uploads: UploadItem[];
}) {
  const sourcePhotoUrl = uploads.find((u) => u.storageUrl)?.storageUrl ?? null;

  const [avatar, setAvatar] = useState<AvatarState>({ status: "idle" });
  const triggered = useRef(false);

  /* Auto-trigger avatar generation once on mount */
  useEffect(() => {
    // if (!sourcePhotoUrl || triggered.current) return;
    // triggered.current = true;
    // generate(sourcePhotoUrl);
  }, [sourcePhotoUrl]);

  async function generate(imageUrl: string) {
    setAvatar({ status: "loading" });
    try {
      const res = await fetch("/api/avatar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ imageUrl }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error ?? "Avatar generation failed");
      }
      const { image } = await res.json();
      setAvatar({ status: "ready", src: image });
    } catch (err) {
      setAvatar({ status: "error", message: (err as Error).message });
    }
  }

  function downloadAvatar() {
    if (avatar.status !== "ready") return;
    const a = document.createElement("a");
    a.href = avatar.src;
    a.download = `apl-s3-avatar-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-apl-page px-6 py-16 text-white md:py-20">

      {/* ── Hero confirmation ─────────────────────────────────────────────── */}
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

      {/* ── AI Avatar reveal ──────────────────────────────────────────────── */}
      {/* sourcePhotoUrl && (
        <AvatarSection
          state={avatar}
          onRetry={() => generate(sourcePhotoUrl)}
          onDownload={downloadAvatar}
        />
      ) */}

      <Link
        href="/"
        className="mt-12 border border-white/20 px-10 py-4 font-mono text-[11px] tracking-[2.5px] text-white transition hover:border-white/40"
      >
        ← BACK TO HOME
      </Link>
    </div>
  );
}

/* ─── AvatarSection ───────────────────────────────────────────────────────── */

function AvatarSection({
  state,
  onRetry,
  onDownload,
}: {
  state:      AvatarState;
  onRetry:    () => void;
  onDownload: () => void;
}) {
  return (
    <section className="mt-14 w-full max-w-[440px]">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="font-mono text-[10px] tracking-[2.5px] text-apl-yellow">
          // YOUR AI AVATAR
        </p>
        <p className="font-mono text-[8px] tracking-[1.5px] text-white/25">
          POWERED BY GEMINI
        </p>
      </div>

      <div
        className="relative aspect-square overflow-hidden border border-apl-yellow/20 bg-[#0d0d0d]"
        style={{ boxShadow: "0 30px 80px -30px rgba(255,195,31,0.18)" }}
      >
        {state.status === "loading" && <AvatarSkeleton />}
        {state.status === "idle"    && <AvatarSkeleton />}

        {state.status === "ready" && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={state.src}
            alt="AI-generated avatar"
            className="h-full w-full animate-apl-pop object-cover"
          />
        )}

        {state.status === "error" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="font-anton text-[40px] leading-none text-apl-red/70">!</span>
            <p className="font-mono text-[10px] leading-relaxed tracking-[1px] text-white/55">
              {state.message}
            </p>
          </div>
        )}
      </div>

      {state.status === "ready" && (
        <button
          type="button"
          onClick={onDownload}
          className="shimmer relative mt-4 w-full overflow-hidden bg-apl-yellow py-[15px] font-anton text-[15px] tracking-[2px] text-apl-ink transition-transform hover:-translate-y-[1px] active:scale-[0.99]"
        >
          ↓ DOWNLOAD AVATAR
        </button>
      )}

      {state.status === "error" && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 w-full border border-white/20 py-[15px] font-mono text-[11px] tracking-[2.5px] text-white transition hover:border-apl-yellow hover:text-apl-yellow"
        >
          ↻ TRY AGAIN
        </button>
      )}

      {state.status === "loading" && (
        <p className="mt-4 text-center font-mono text-[9px] tracking-[2px] text-white/35">
          GENERATING · TYPICALLY 10–20 SECONDS
        </p>
      )}
    </section>
  );
}

/* ─── AvatarSkeleton ──────────────────────────────────────────────────────── */

function AvatarSkeleton() {
  return (
    <div className="relative h-full w-full">
      {/* base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101010] via-[#161616] to-[#0a0a0a]" />
      {/* shimmer */}
      <div
        className="absolute inset-0 animate-skeleton"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,195,31,0.06) 50%, transparent 100%)",
        }}
      />
      {/* center mark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-apl-yellow" />
        <span className="font-mono text-[9px] tracking-[3px] text-white/35">RENDERING</span>
      </div>
    </div>
  );
}
import Link from "next/link";
import { APL_SEASON } from "@/lib/constants";
import type { UploadItem } from "./types";
import { downloadImage } from "./utils";

export function SuccessScreen({
  phone,
  uploads,
}: {
  phone:   string;
  uploads: UploadItem[];
}) {
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
              onClick={() => saved.forEach((u) => downloadImage(u.storageUrl!, u.file.name))}
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

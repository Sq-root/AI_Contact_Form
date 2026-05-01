import { useState, useRef } from "react";
import { StepHeader } from "../StepHeader";
import { downloadImage } from "../utils";
import type { Step4Props, UploadItem } from "../types";

/* ─── ImageDropZone ───────────────────────────────────────────────────────── */

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

/* ─── UploadCard ──────────────────────────────────────────────────────────── */

function UploadCard({ item, onRemove }: { item: UploadItem; onRemove: () => void }) {
  return (
    <div className="group relative overflow-hidden border border-white/[0.07]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.localUrl} alt={item.file.name} className="aspect-square w-full object-cover" />

      {item.uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-apl-ink/82">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-apl-yellow" />
          <span className="font-mono text-[7px] tracking-[1.5px] text-apl-yellow">UPLOADING</span>
        </div>
      )}

      {item.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-apl-red/20 p-2">
          <span className="text-center font-mono text-[7px] leading-snug text-white">{item.error}</span>
        </div>
      )}

      {item.storageUrl && !item.uploading && (
        <span className="absolute left-2 top-2 bg-apl-yellow px-1.5 py-[2px] font-mono text-[7px] tracking-[1px] text-apl-ink">
          ✓
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-apl-ink/90 px-2 py-1.5 opacity-0 transition group-hover:opacity-100">
        <span className="min-w-0 truncate font-mono text-[7px] text-white/40">{item.file.name}</span>
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

/* ─── Step4Photos ─────────────────────────────────────────────────────────── */

export function Step4Photos({
  errors,
  uploads,
  uploadErr,
  onAddImages,
  onRemoveImage,
}: Step4Props) {
  return (
    <>
      <StepHeader
        eyebrow="// STEP 04 OF 04"
        title={<>Upload <span className="text-apl-yellow">photos.</span></>}
        sub="Optional — images are stored securely and will be analysed by an AI model in a future update."
      />

      <ImageDropZone onAdd={onAddImages} />

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
                onRemove={() => onRemoveImage(item.id)}
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

      {errors._server && (
        <div className="mt-6 border border-apl-red/30 bg-apl-red/10 px-5 py-4 font-mono text-[10px] tracking-[0.5px] text-apl-red">
          ✕ {errors._server}
        </div>
      )}
    </>
  );
}

import { useRef, useState } from "react";
import { StepHeader } from "../StepHeader";
import type { Step3PhotosProps, UploadItem } from "../types";

function DropZone({ onAdd }: { onAdd: (files: FileList) => void }) {
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
      className={`cursor-pointer border-2 border-dashed py-20 text-center transition-all duration-200 ${
        over
          ? "border-apl-yellow bg-apl-yellow/5"
          : "border-white/[0.12] hover:border-white/25 hover:bg-white/[0.03]"
      }`}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { if (e.target.files) onAdd(e.target.files); e.target.value = ""; }}
      />
      <span className="block font-anton text-[64px] leading-none text-white/15">↑</span>
      <p className="mt-4 font-mono text-[11px] tracking-[2.5px] text-white/55">
        DRAG &amp; DROP OR CLICK TO BROWSE
      </p>
      <p className="mt-1.5 font-mono text-[9px] tracking-[1.5px] text-white/30">
        ONE PHOTO · JPG · PNG · WEBP · MAX 5 MB
      </p>
    </div>
  );
}

function Preview({
  item,
  onReplace,
  onRemove,
}: {
  item: UploadItem;
  onReplace: (files: FileList) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <div className="relative overflow-hidden border border-white/[0.12] bg-[#041513]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.localUrl} alt={item.file.name} className="aspect-square w-full object-cover" />

        {item.uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-apl-ink/82">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-apl-yellow" />
            <span className="font-mono text-[10px] tracking-[2px] text-apl-yellow">UPLOADING…</span>
          </div>
        )}

        {item.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-apl-red/25 p-4">
            <span className="text-center font-mono text-[10px] leading-snug text-white">
              ✕ {item.error}
            </span>
          </div>
        )}

        {item.storageUrl && !item.uploading && (
          <span className="absolute left-3 top-3 bg-apl-yellow px-2 py-[3px] font-mono text-[8px] tracking-[1.5px] text-apl-ink">
            ✓ UPLOADED
          </span>
        )}
      </div>

      <p className="mt-2 truncate font-mono text-[9px] tracking-[1px] text-white/40">
        {item.file.name}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => { if (e.target.files) onReplace(e.target.files); e.target.value = ""; }}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="border border-white/[0.14] py-3 font-mono text-[10px] tracking-[2px] text-white/70 transition hover:border-apl-yellow/60 hover:text-apl-yellow"
        >
          ↻ REPLACE PHOTO
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="border border-white/[0.1] py-3 font-mono text-[10px] tracking-[2px] text-white/50 transition hover:border-apl-red/60 hover:text-apl-red"
        >
          ✕ REMOVE
        </button>
      </div>
    </div>
  );
}

export function Step3Photos({
  errors,
  uploads,
  uploadErr,
  onAddImages,
  onRemoveImage,
}: Step3PhotosProps) {
  const current = uploads[0];

  return (
    <>
      <StepHeader
        eyebrow="// STEP 03 OF 03"
        title={<>Profile <span className="text-apl-yellow">image.</span></>}
        sub="Upload one clear profile photo. It will also be used to generate your AI avatar."
      />

      {current ? (
        <Preview
          item={current}
          onReplace={onAddImages}
          onRemove={() => onRemoveImage(current.id)}
        />
      ) : (
        <DropZone onAdd={onAddImages} />
      )}

      {errors.imageUrls && (
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.5px] text-apl-red">
          <span>✕</span> {errors.imageUrls}
        </p>
      )}

      {uploadErr && (
        <p className="mt-3 font-mono text-[9px] text-apl-red">{uploadErr}</p>
      )}
    </>
  );
}

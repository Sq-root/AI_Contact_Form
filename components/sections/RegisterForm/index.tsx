"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { uploadImage } from "@/lib/cloudinary";
import type { FormData } from "@/types";

import { type UploadItem, type FieldErrors, STEPS, INITIAL, MAX_SIZE } from "./types";
import { validateStep } from "./validation";
import { StepperBar } from "./StepperBar";
import { SuccessScreen } from "./SuccessScreen";
import { Step1Personal } from "./steps/Step1Personal";
import { Step2Cricket } from "./steps/Step2Cricket";
import { Step3Sabha } from "./steps/Step3Sabha";
import { Step4Photos } from "./steps/Step4Photos";

const LAST_STEP = STEPS.length; // 4

type RegistrationSuccess = {
  id: string;
  paymentClaimed: boolean;
  paymentReferenceNumber: string | null;
  paymentDone: boolean;
};

export default function RegisterForm() {
  const [step,      setStep]      = useState(1);
  const [data,      setData]      = useState<FormData>(INITIAL);
  const [errors,    setErrors]    = useState<FieldErrors>({});
  const [uploads,   setUploads]   = useState<UploadItem[]>([]);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [successData, setSuccessData] = useState<RegistrationSuccess | null>(null);

  /* ── Field change (clears its own error) ─────────────────────────────── */

  const handleChange = useCallback((key: keyof FormData, value: string | string[]) => {
    setData((d) => ({ ...d, [key]: value } as FormData));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  /* ── Image upload / remove ────────────────────────────────────────────── */

  const handleAddImages = useCallback((files: FileList) => {
    const file = files[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setUploadErr(`"${file.name}" exceeds 5 MB.`);
      return;
    }
    setUploadErr(null);

    const item: UploadItem = {
      id:         `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      localUrl:   URL.createObjectURL(file),
      storageUrl: null,
      uploading:  true,
      error:      null,
    };

    /* Replace any prior upload — only one image is allowed */
    setUploads((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u.localUrl));
      return [item];
    });
    setData((d) => ({ ...d, imageUrls: [] }));

    (async () => {
      try {
        const url = await uploadImage(item.file);
        setUploads((p) => p.map((u) => u.id === item.id ? { ...u, uploading: false, storageUrl: url } : u));
        setData((d) => ({ ...d, imageUrls: [url] }));
      } catch (err) {
        setUploads((p) => p.map((u) => u.id === item.id ? { ...u, uploading: false, error: (err as Error).message } : u));
      }
    })();
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

  /* ── Navigation ───────────────────────────────────────────────────────── */

  const handleNext = async () => {
    /* Steps 1–4: validate then advance */
    if (step < LAST_STEP) {
      const errs = validateStep(step, data);
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setErrors({});
      setStep((s) => s + 1);
      return;
    }

    /* Step 4: validate then submit */
    if (uploads.some((u) => u.uploading)) return;

    const submitErrs = validateStep(4, data);
    if (Object.keys(submitErrs).length) { setErrors(submitErrs); return; }

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
          playingRole:   data.playingRole,
          sabhaLike:     data.sabhaLike.join(", "),
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

    const payload = (await res.json()) as { id: string };
    setSuccessData({
      id: payload.id,
      paymentClaimed: false,
      paymentReferenceNumber: null,
      paymentDone: false
    });
    setSuccess(true);
  };

  const handleBack = () => { setStep((s) => s - 1); setErrors({}); };

  /* ── Early exit ───────────────────────────────────────────────────────── */

  if (success) {
    return (
      <SuccessScreen
        registrationId={successData?.id || ""}
        phone={data.phone}
        fullName={data.fullName}
        uploads={uploads}
        initialPaymentClaimed={Boolean(successData?.paymentClaimed)}
        initialPaymentReferenceNumber={successData?.paymentReferenceNumber || null}
        initialPaymentDone={Boolean(successData?.paymentDone)}
      />
    );
  }

  const isLastStep   = step === LAST_STEP;
  const anyUploading = uploads.some((u) => u.uploading);
  const ctaLabel     = loading                   ? "SUBMITTING…"
                     : isLastStep && anyUploading ? "UPLOADING…"
                     : isLastStep                 ? "SUBMIT REGISTRATION →"
                     : "CONTINUE →";

  const stepProps = { data, errors, onChange: handleChange };

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="flex min-h-screen flex-col bg-apl-ink text-white">

      {/* Top nav */}
      <header className="border-b border-white/[0.06] px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-[680px] items-center justify-between">
          <Link href="/" className="font-mono text-[10px] tracking-[2.5px] text-white/40 transition hover:text-white">
            ← HOME
          </Link>
          <span className="font-mono text-[10px] tracking-[2.5px] text-white/20">APL · S3 · REGISTER</span>
        </div>
      </header>

      {/* Stepper */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[680px]">
          <StepperBar current={step} />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-auto scrollbar-none">
        <div className="mx-auto max-w-[680px] px-6 pb-36 pt-10 md:px-12 md:pt-12">
          <div key={step} className="animate-step-in">
            {step === 1 && <Step1Personal {...stepProps} />}
            {step === 2 && <Step2Cricket  {...stepProps} />}
            {step === 3 && <Step3Sabha    {...stepProps} />}
            {step === 4 && (
              <Step4Photos
                {...stepProps}
                uploads={uploads}
                uploadErr={uploadErr}
                onAddImages={handleAddImages}
                onRemoveImage={handleRemoveImage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-white/[0.05] px-6 pb-8 pt-5 md:px-12"
        style={{ background: "linear-gradient(to top, var(--apl-ink) 65%, rgba(10,10,10,0.94))" }}
      >
        <div className="mx-auto flex max-w-[680px] items-center gap-3">
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

          <button
            type="button"
            onClick={handleNext}
            disabled={loading || (isLastStep && anyUploading)}
            className="shimmer relative flex-1 overflow-hidden bg-apl-yellow py-[15px] font-anton text-[17px] tracking-[2px] text-apl-ink transition-transform hover:-translate-y-[1px] active:scale-[0.99] disabled:opacity-55 md:text-[19px]"
          >
            {ctaLabel}
          </button>
        </div>

        <p className="mt-3 text-center font-mono text-[8px] tracking-[2px] text-white/20">
          {step} / {STEPS.length} COMPLETED
        </p>
      </div>

    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { uploadImage } from "@/lib/cloudinary";
import { APL_SEASON } from "@/lib/constants";
import type { FormData } from "@/types";

import { type FieldErrors, type UploadItem, INITIAL, MAX_SIZE, STEPS } from "./types";
import { validateStep } from "./validation";
import { StepperBar } from "./StepperBar";
import { SuccessScreen } from "./SuccessScreen";
import { Step1Personal } from "./steps/Step1Personal";
import { Step2Cricket } from "./steps/Step2Cricket";
import { Step3Photos } from "./steps/Step3Photos";

const LAST_STEP = STEPS.length;

type RegistrationSuccess = {
  id: string;
  paymentClaimed: boolean;
  paymentReferenceNumber: string | null;
  paymentDone: boolean;
};

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<RegistrationSuccess | null>(null);

  const handleChange = useCallback((key: keyof FormData, value: string | string[]) => {
    setData((d) => ({ ...d, [key]: value } as FormData));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const handleAddImages = useCallback((files: FileList) => {
    const file = files[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setUploadErr(`"${file.name}" exceeds 5 MB.`);
      return;
    }
    setUploadErr(null);

    const item: UploadItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      localUrl: URL.createObjectURL(file),
      storageUrl: null,
      uploading: true,
      error: null,
    };

    setUploads((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u.localUrl));
      return [item];
    });
    setData((d) => ({ ...d, imageUrls: [] }));
    setErrors((prev) => ({ ...prev, imageUrls: undefined }));

    (async () => {
      try {
        const url = await uploadImage(item.file);
        setUploads((p) => p.map((u) => (u.id === item.id ? { ...u, uploading: false, storageUrl: url } : u)));
        setData((d) => ({ ...d, imageUrls: [url] }));
      } catch (err) {
        setUploads((p) => p.map((u) => (u.id === item.id ? { ...u, uploading: false, error: (err as Error).message } : u)));
      }
    })();
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setUploads((prev) => {
      const item = prev.find((u) => u.id === id);
      if (item) {
        URL.revokeObjectURL(item.localUrl);
        if (item.storageUrl) {
          setData((d) => ({ ...d, imageUrls: d.imageUrls.filter((u) => u !== item.storageUrl) }));
        }
      }
      return prev.filter((u) => u.id !== id);
    });
  }, []);

  const handleNext = async () => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    if (step < LAST_STEP) {
      setErrors({});
      setStep((s) => s + 1);
      return;
    }

    if (uploads.some((u) => u.uploading)) return;

    setLoading(true);
    setErrors({});

    let res: Response;
    try {
      res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          battingStyle: data.battingStyle,
          bowlingStyle: data.bowlingStyle,
          referenceName: data.referenceName,
          playingRole: data.playingRole,
          imageUrls: data.imageUrls,
        }),
      });
    } catch {
      setLoading(false);
      setErrors({ _server: "Network error. Check your connection and try again." });
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
      paymentDone: false,
    });
    setSuccess(true);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

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

  const isLastStep = step === LAST_STEP;
  const anyUploading = uploads.some((u) => u.uploading);
  const ctaLabel = loading
    ? "SUBMITTING..."
    : isLastStep && anyUploading
      ? "UPLOADING..."
      : isLastStep
        ? "SUBMIT REGISTRATION"
        : "CONTINUE";

  const stepProps = { data, errors, onChange: handleChange };

  return (
    <div className="adelaide-register-bg relative flex min-h-screen flex-col overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-pitch-lines opacity-[0.12]" aria-hidden="true" />
      
      {/* Premium ambient decorative glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-apl-yellow/8 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-apl-green/8 blur-[120px]" />

      <header className="relative z-10 border-b border-white/[0.1] bg-black/18 px-6 py-4 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-[680px] items-center justify-between">
          <Link href="/" className="font-mono text-[10px] tracking-[2.5px] text-white/62 transition hover:text-apl-yellow">
            HOME
          </Link>
          <span className="font-mono text-[10px] tracking-[2.5px] text-apl-yellow/70">
            {APL_SEASON.leagueShort} S{parseInt(APL_SEASON.number, 10)} REGISTER
          </span>
        </div>
      </header>

      <div className="relative z-10 border-b border-white/[0.1] bg-black/14 backdrop-blur-md">
        <div className="mx-auto max-w-[680px]">
          <StepperBar current={step} />
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-auto scrollbar-none">
        <div className="mx-auto max-w-[680px] px-6 pb-36 pt-10 md:px-12 md:pt-12">
          {errors._server && (
            <p className="mb-6 border border-apl-red/30 bg-apl-red/10 px-4 py-3 font-mono text-[10px] leading-5 tracking-[0.8px] text-apl-red">
              {errors._server}
            </p>
          )}
          <div key={step} className="animate-step-in rounded-lg border border-white/[0.12] bg-[#041513]/78 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-md md:p-7">
            {step === 1 && <Step1Personal {...stepProps} />}
            {step === 2 && <Step2Cricket {...stepProps} />}
            {step === 3 && (
              <Step3Photos
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

      <div
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/[0.1] px-6 pb-8 pt-5 backdrop-blur-xl md:px-12"
        style={{ background: "linear-gradient(to top, rgba(3,19,18,0.98) 65%, rgba(3,19,18,0.82))" }}
      >
        <div className="mx-auto flex max-w-[680px] items-center gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="shrink-0 border border-white/[0.16] bg-white/[0.04] px-6 py-[15px] font-mono text-[10px] tracking-[1.5px] text-white/68 transition hover:border-apl-yellow/50 hover:text-apl-yellow"
            >
              BACK
            </button>
          ) : (
            <Link
              href="/"
              className="shrink-0 border border-white/[0.16] bg-white/[0.04] px-6 py-[15px] font-mono text-[10px] tracking-[1.5px] text-white/68 transition hover:border-apl-yellow/50 hover:text-apl-yellow"
            >
              HOME
            </Link>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={loading || (isLastStep && anyUploading)}
            className="shimmer relative flex-1 overflow-hidden bg-apl-yellow py-[15px] font-anton text-[17px] tracking-[2px] text-apl-ink shadow-[0_16px_42px_rgba(246,200,95,0.28)] transition-transform hover:-translate-y-[1px] hover:bg-[#ffe08a] active:scale-[0.99] disabled:opacity-55 md:text-[19px]"
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

import type { FormData } from "@/types";
import type { FieldErrors } from "./types";

export function validateStep(step: number, data: FormData): FieldErrors {
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
    if (!data.battingStyle)        e.battingStyle  = "Please select one";
    if (!data.bowlingStyle)        e.bowlingStyle  = "Please select one";
    if (!data.referenceName.trim()) e.referenceName = "Reference name is required";
  }

  if (step === 3) {
    if (!data.sabhaLike) e.sabhaLike = "Please select one";
    if (data.sabhaLike === "Other" && !data.sabhaLikeOther.trim())
      e.sabhaLikeOther = "Please specify";
  }

  return e;
}

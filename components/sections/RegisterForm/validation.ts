import type { FormData } from "@/types";
import type { FieldErrors } from "./types";

export function validateStep(step: number, data: FormData): FieldErrors {
  const e: FieldErrors = {};

  if (step === 1) {
    if (!data.fullName.trim()) {
      e.fullName = "Name is required";
    }
    const phone = data.phone.replace(/[\s\-()+]/g, "");
    if (!/^(91|0)?[6-9]\d{9}$/.test(phone)) {
      e.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!data.address.trim()) {
      e.address = "Address is required";
    }
  }

  if (step === 2) {
    if (!data.playingRole) e.playingRole = "Please select one";
    if (!data.battingStyle) e.battingStyle = "Please select one";
    if (!data.bowlingStyle) e.bowlingStyle = "Please select one";
    if (!data.referenceName.trim()) e.referenceName = "Reference name is required";
  }

  if (step === 3) {
    if (!data.imageUrls.length) {
      e.imageUrls = "Please upload one profile photo";
    }
  }

  return e;
}

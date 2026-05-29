import { Input } from "@/components/ui/Input";
import { StepHeader } from "../StepHeader";
import type { StepProps } from "../types";

export function Step1Personal({ data, errors, onChange }: StepProps) {
  return (
    <>
      <StepHeader
        eyebrow="// STEP 01 OF 03"
        title={<>Player <span className="text-apl-yellow">details.</span></>}
        sub="Share your contact details for tournament registration."
      />

      <Input
        label="Name"
        value={data.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        placeholder="e.g. Aarav Patel"
        required
        error={errors.fullName}
      />

      <Input
        label="Mobile No"
        type="tel"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        placeholder="+91 98765 43210"
        required
        hint="Indian 10-digit"
        error={errors.phone}
      />
    </>
  );
}

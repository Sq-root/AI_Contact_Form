import { Input } from "@/components/ui/Input";
import { TileSelect } from "@/components/ui/TileSelect";
import { FIELD_OF_STUDY_OPTIONS } from "@/lib/constants";
import { StepHeader } from "../StepHeader";
import type { StepProps } from "../types";

export function Step1Personal({ data, errors, onChange }: StepProps) {
  return (
    <>
      <StepHeader
        eyebrow="// STEP 01 OF 04"
        title={<>Who are <span className="text-apl-yellow">you?</span></>}
        sub="Tell us who you are so we can set up your registration."
      />

      <Input
        label="Full Name"
        value={data.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        placeholder="e.g. Aarav Patel"
        required
        error={errors.fullName}
      />

      <Input
        label="Phone Number"
        type="tel"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        placeholder="+91 98765 43210"
        required
        hint="Indian 10-digit"
        error={errors.phone}
      />

      <TileSelect
        label="Field of Study"
        options={FIELD_OF_STUDY_OPTIONS}
        value={data.fieldOfStudy}
        onChange={(v) => onChange("fieldOfStudy", v)}
        cols={2}
        required
        error={errors.fieldOfStudy}
        withOther
        otherValue={data.fieldOfStudyOther}
        onOtherChange={(v) => onChange("fieldOfStudyOther", v)}
        otherError={errors.fieldOfStudyOther}
      />
    </>
  );
}

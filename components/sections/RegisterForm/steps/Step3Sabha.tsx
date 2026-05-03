import { Textarea } from "@/components/ui/Textarea";
import { TileSelect } from "@/components/ui/TileSelect";
import { SABHA_LIKES } from "@/lib/constants";
import { StepHeader } from "../StepHeader";
import type { StepProps } from "../types";

export function Step3Sabha({ data, errors, onChange }: StepProps) {
  return (
    <>
      <StepHeader
        eyebrow="// STEP 03 OF 04"
        title={<>Your <span className="text-apl-yellow">Sabha.</span></>}
        sub="Help us understand what matters most to you in Sabha."
      />

      <TileSelect
        label="What do you like most in Sabha?"
        options={SABHA_LIKES}
        multi
        value={data.sabhaLike}
        onChange={(v) => onChange("sabhaLike", v)}
        cols={1}
        required
        error={errors.sabhaLike}
      />

      <Textarea
        label="Other Topics You Expect Us to Cover"
        value={data.otherTopics}
        onChange={(e) => onChange("otherTopics", e.target.value)}
        placeholder="e.g. Physical Health, Finance, Career Guidance"
      />
    </>
  );
}

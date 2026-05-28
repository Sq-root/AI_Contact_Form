import { Input } from "@/components/ui/Input";
import { TileSelect } from "@/components/ui/TileSelect";
import { APL_ROLES, BATTING_STYLES, BOWLING_STYLES } from "@/lib/constants";
import { StepHeader } from "../StepHeader";
import type { StepProps } from "../types";

export function Step2Cricket({ data, errors, onChange }: StepProps) {
  return (
    <>
      <StepHeader
        eyebrow="// STEP 02 OF 03"
        title={<>Tournament <span className="text-apl-yellow">profile.</span></>}
        sub="Tell us how you want to participate and how you play."
      />

      <TileSelect
        label="How would you like to participate in the Tournament?"
        options={APL_ROLES}
        value={data.playingRole}
        onChange={(v) => onChange("playingRole", v)}
        cols={1}
        required
        error={errors.playingRole}
      />

      <TileSelect
        label="What is your batting style?"
        options={BATTING_STYLES}
        value={data.battingStyle}
        onChange={(v) => onChange("battingStyle", v)}
        required
        error={errors.battingStyle}
      />

      <TileSelect
        label="What is your bowling style?"
        options={BOWLING_STYLES}
        value={data.bowlingStyle}
        onChange={(v) => onChange("bowlingStyle", v)}
        required
        error={errors.bowlingStyle}
      />

      <Input
        label="Reference Name"
        value={data.referenceName}
        onChange={(e) => onChange("referenceName", e.target.value)}
        placeholder="e.g. Harshil Soni"
        required
        error={errors.referenceName}
      />
    </>
  );
}

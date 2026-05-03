import { Input } from "@/components/ui/Input";
import { TileSelect } from "@/components/ui/TileSelect";
import { BATTING_STYLES, BOWLING_STYLES, APL_ROLES } from "@/lib/constants";
import { StepHeader } from "../StepHeader";
import type { StepProps } from "../types";

export function Step2Cricket({ data, errors, onChange }: StepProps) {
  return (
    <>
      <StepHeader
        eyebrow="// STEP 02 OF 04"
        title={<>Cricket <span className="text-apl-yellow">profile.</span></>}
        sub="Tell us how you play the game and who referred you."
      />

      <TileSelect
        label="Playing Role"
        options={APL_ROLES}
        value={data.playingRole}
        onChange={(v) => onChange("playingRole", v)}
        cols={2}
        required
        error={errors.playingRole}
      />

      <TileSelect
        label="Batting Style"
        options={BATTING_STYLES}
        value={data.battingStyle}
        onChange={(v) => onChange("battingStyle", v)}
        cols={2}
        required
        error={errors.battingStyle}
      />

      <TileSelect
        label="Bowling Style"
        options={BOWLING_STYLES}
        value={data.bowlingStyle}
        onChange={(v) => onChange("bowlingStyle", v)}
        cols={2}
        required
        error={errors.bowlingStyle}
      />

      <Input
        label="Reference Name (Follow Up Sevak)"
        value={data.referenceName}
        onChange={(e) => onChange("referenceName", e.target.value)}
        placeholder="e.g. Harshil Soni"
        required
        error={errors.referenceName}
      />
    </>
  );
}

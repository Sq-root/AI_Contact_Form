import type { FormData } from "@/types";

export interface UploadItem {
  id:         string;
  file:       File;
  localUrl:   string;
  storageUrl: string | null;
  uploading:  boolean;
  error:      string | null;
}

export type FieldErrors = Partial<Record<keyof FormData | "_server", string>>;

export const STEPS = [
  { n: 1, label: "PERSONAL"  },
  { n: 2, label: "PLAYING"   },
  { n: 3, label: "SPIRITUAL" },
  { n: 4, label: "AI AVATAR" },
] as const;

export const INITIAL: FormData = {
  /* Step 1 */
  fullName:          "",
  phone:             "",
  fieldOfStudy:      "",
  fieldOfStudyOther: "",

  /* Step 2 */
  battingStyle:      "",
  bowlingStyle:      "",
  referenceName:     "",
  playingRole:       "",

  /* Step 3 */
  sabhaLike:         [],
  sabhaLikeOther:    "",
  otherTopics:       "",

  /* Step 4 */
  imageUrls:         [],
};

export const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/* ─── Step component interfaces ───────────────────────────────────────────── */

export interface StepProps {
  data:     FormData;
  errors:   FieldErrors;
  onChange: (key: keyof FormData, value: string | string[]) => void;
}

export interface Step4Props extends StepProps {
  uploads:       UploadItem[];
  uploadErr:     string | null;
  onAddImages:   (files: FileList) => void;
  onRemoveImage: (id: string) => void;
}

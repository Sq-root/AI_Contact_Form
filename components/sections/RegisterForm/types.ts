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
  { n: 3, label: "SPRITUAL"  },
  { n: 4, label: "AI AVATAR" },
] as const;

export const INITIAL: FormData = {
  fullName:          "",
  phone:             "",
  fieldOfStudy:      "",
  fieldOfStudyOther: "",
  battingStyle:      "",
  bowlingStyle:      "",
  referenceName:     "",
  sabhaLike:         "",
  sabhaLikeOther:    "",
  otherTopics:       "",
  imageUrls:         [],
};

export const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/* ─── Step component interfaces ───────────────────────────────────────────── */

export interface StepProps {
  data:     FormData;
  errors:   FieldErrors;
  onChange: (key: keyof FormData, value: string) => void;
}

export interface Step4Props extends StepProps {
  uploads:       UploadItem[];
  uploadErr:     string | null;
  onAddImages:   (files: FileList) => void;
  onRemoveImage: (id: string) => void;
}

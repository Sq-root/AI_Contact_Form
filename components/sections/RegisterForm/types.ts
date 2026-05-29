import type { FormData } from "@/types";

export interface UploadItem {
  id: string;
  file: File;
  localUrl: string;
  storageUrl: string | null;
  uploading: boolean;
  error: string | null;
}

export type FieldErrors = Partial<Record<keyof FormData | "_server", string>>;

export const STEPS = [
  { n: 1, label: "DETAILS" },
  { n: 2, label: "CRICKET" },
  { n: 3, label: "PHOTO" },
] as const;

export const INITIAL: FormData = {
  fullName: "",
  phone: "",
  playingRole: "",
  battingStyle: "",
  bowlingStyle: "",
  referenceName: "",
  imageUrls: [],
};

export const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export interface StepProps {
  data: FormData;
  errors: FieldErrors;
  onChange: (key: keyof FormData, value: string | string[]) => void;
}

export interface Step3PhotosProps extends StepProps {
  uploads: UploadItem[];
  uploadErr: string | null;
  onAddImages: (files: FileList) => void;
  onRemoveImage: (id: string) => void;
}

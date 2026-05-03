/* ─── Cloudinary unsigned upload (browser-direct) ─────────────────────────────
   We use an unsigned upload preset so the file goes:
     browser → Cloudinary
   without a Next.js round-trip. The preset (configured in Cloudinary dashboard)
   enforces size/format/folder restrictions, so no secrets ship to the client.

   Required env vars (.env.local):
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME      e.g. "apl-s3"
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET   e.g. "apl_unsigned"
────────────────────────────────────────────────────────────────────────────── */

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const DEFAULT_FOLDER = "apl-registrations";

interface CloudinaryResponse {
  secure_url: string;
  public_id:  string;
  bytes:      number;
  format:     string;
  error?:     { message: string };
}

export async function uploadImage(
  file:   File,
  folder: string = DEFAULT_FOLDER,
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary not configured — set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local.",
    );
  }

  const form = new FormData();
  form.append("file",          file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder",        folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );

  const json = (await res.json().catch(() => ({}))) as CloudinaryResponse;

  if (!res.ok || !json.secure_url) {
    throw new Error(json.error?.message ?? `Upload failed (${res.status}).`);
  }

  return json.secure_url;
}
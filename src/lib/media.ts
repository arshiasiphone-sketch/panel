import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  beginOptimisticUpdate,
  rollbackOptimisticUpdate,
  touchLocalCmsEdit,
  upsertById,
  removeById,
} from "./cms-sync";
import { QK } from "./test-db";

export type MediaFile = Database["public"]["Tables"]["media_files"]["Row"];

const BUCKET = "media";

/** MIME types the storage bucket accepts (kept in sync with the migration). */
export const ACCEPTED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;
export type AcceptedImageMime = (typeof ACCEPTED_IMAGE_MIMES)[number];

/** File extensions matching ACCEPTED_IMAGE_MIMES — checked as a second line of defence. */
const ACCEPTED_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"] as const;

/** Default upload ceiling — must stay <= the bucket's `file_size_limit` in the migration. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function getMediaPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Reverse of getMediaPublicUrl. Returns null when the URL isn't a public URL
 * for this project's media bucket (e.g. legacy hand-pasted external URLs).
 */
export function getStoragePathFromPublicUrl(publicUrl: string): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  try {
    return decodeURIComponent(publicUrl.slice(idx + marker.length));
  } catch {
    return null;
  }
}

export type ImageValidationError =
  | { code: "type"; message: string }
  | { code: "size"; message: string }
  | { code: "extension"; message: string };

/** Pure client-side validation. Returns null if the file is acceptable. */
export function validateImageFile(
  file: File,
  maxBytes: number = MAX_IMAGE_BYTES,
): ImageValidationError | null {
  const mime = file.type as AcceptedImageMime;
  if (!ACCEPTED_IMAGE_MIMES.includes(mime)) {
    return {
      code: "type",
      message: "فقط فایل‌های تصویری (JPG, PNG, WEBP, GIF, SVG) پذیرفته می‌شود.",
    };
  }
  const lowerName = file.name.toLowerCase();
  const hasOkExt = ACCEPTED_IMAGE_EXTS.some((ext) => lowerName.endsWith(ext));
  if (!hasOkExt) {
    return { code: "extension", message: "پسوند فایل معتبر نیست." };
  }
  if (file.size > maxBytes) {
    const mb = (maxBytes / (1024 * 1024)).toFixed(1);
    return { code: "size", message: `حجم فایل بیشتر از ${mb} مگابایت است.` };
  }
  return null;
}

/**
 * Best-effort, transparency-preserving downscale. Skipped for SVG/GIF (vector
 * / animation) and for files that already fit comfortably. Falls back to the
 * original file on any failure so an upload never silently corrupts data.
 */
export async function compressImageIfLarge(
  file: File,
  opts: { maxDimension?: number; targetBytes?: number } = {},
): Promise<File> {
  const maxDimension = opts.maxDimension ?? 2048;
  const targetBytes = opts.targetBytes ?? 1.5 * 1024 * 1024;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  if (file.size <= targetBytes) return file;
  if (typeof document === "undefined" || typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    if (scale >= 1 && file.size <= targetBytes * 2) return file;
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const preservesAlpha = file.type === "image/png" || file.type === "image/webp";
    const outType: AcceptedImageMime = preservesAlpha ? "image/webp" : "image/jpeg";
    const quality = 0.86;
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), outType, quality),
    );
    if (!blob || blob.size >= file.size) return file;
    const ext = outType === "image/webp" ? ".webp" : ".jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}${ext}`, { type: outType, lastModified: Date.now() });
  } catch {
    return file;
  }
}

export function useMediaFiles() {
  return useQuery({
    queryKey: QK.media,
    queryFn: async (): Promise<MediaFile[]> => {
      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { file: File; folder?: string }) => {
      const folder = input.folder ?? "uploads";
      const safeName = input.file.name.replace(/[^\w.\-()+\u0600-\u06FF]/g, "_");
      const storagePath = `${folder}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, input.file, { upsert: false, contentType: input.file.type });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("media_files")
        .insert({
          name: input.file.name,
          storage_path: storagePath,
          folder,
          tags: [],
          size_bytes: input.file.size,
          mime_type: input.file.type,
        })
        .select()
        .single();
      if (error) {
        await supabase.storage.from(BUCKET).remove([storagePath]);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      touchLocalCmsEdit();
      qc.setQueryData<MediaFile[]>(QK.media, (list) => upsertById(list, data));
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: MediaFile) => {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([file.storage_path]);
      if (storageError) throw storageError;
      const { error } = await supabase.from("media_files").delete().eq("id", file.id);
      if (error) throw error;
    },
    onMutate: async (file) =>
      beginOptimisticUpdate<MediaFile[]>(qc, QK.media, (list) => removeById(list, file.id)),
    onError: (_err, _file, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.media, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

/**
 * Delete a previously-uploaded image when the caller only knows its public URL
 * (e.g. when replacing an image stored on a CMS row). Silently no-ops for URLs
 * not owned by this bucket so legacy external URLs don't break the flow.
 */
export async function deleteMediaByPublicUrl(publicUrl: string): Promise<void> {
  const storagePath = getStoragePathFromPublicUrl(publicUrl);
  if (!storagePath) return;
  await supabase.storage.from(BUCKET).remove([storagePath]);
  await supabase.from("media_files").delete().eq("storage_path", storagePath);
}

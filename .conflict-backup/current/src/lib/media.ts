import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import {
  beginOptimisticUpdate,
  rollbackOptimisticUpdate,
  touchLocalCmsEdit,
  upsertById,
  removeById,
} from "./cms-sync";
import { useRepositories } from "@/lib/providers";
import { QK } from "./test-db";

export type MediaFile = Database["public"]["Tables"]["media_files"]["Row"];

/** Accepted image MIME types for upload validation */
export const ACCEPTED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

/** Default maximum image size (5 MB) */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Compress image if it exceeds a size threshold.
 * Falls back to original file if compression fails.
 */
export async function compressImageIfLarge(file: File, maxBytes = MAX_IMAGE_BYTES): Promise<File> {
  if (file.size <= maxBytes || !file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    let width = bitmap.width;
    let height = bitmap.height;
    const maxDim = 1920;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, file.type, 0.82),
    );
    if (!blob) return file;
    return new File([blob], file.name, { type: file.type });
  } catch {
    return file;
  }
}

/**
 * Validate an image file for upload.
 * Returns an error object or null if valid.
 */
export function validateImageFile(
  file: File,
  maxBytes = MAX_IMAGE_BYTES,
): { valid: false; message: string } | null {
  if (!file) return { valid: false, message: "فایلی انتخاب نشده است." };
  if (!ACCEPTED_IMAGE_MIMES.includes(file.type as (typeof ACCEPTED_IMAGE_MIMES)[number])) {
    return { valid: false, message: "نوع فایل مجاز نیست. فقط JPG, PNG, WEBP, GIF, SVG" };
  }
  if (file.size > maxBytes) {
    return {
      valid: false,
      message: `حجم فایل بیش از ${(maxBytes / (1024 * 1024)).toFixed(0)} مگابایت است.`,
    };
  }
  return null;
}

/**
 * Delete a media file from storage by its public URL.
 * Extracts the storage path from the URL and removes it.
 */
export async function deleteMediaByPublicUrl(publicUrl: string): Promise<void> {
  const repos = useRepositories();
  await repos.media.deleteByPublicUrl(publicUrl);
}

export function getMediaPublicUrl(storagePath: string): string {
  const repos = useRepositories();
  return repos.media.getPublicUrl(storagePath);
}

export function useMediaFiles() {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.media,
    queryFn: (): Promise<MediaFile[]> => repos.media.getAll(),
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (input: { file: File; folder?: string }) => {
      return repos.media.upload(input.file, input.folder);
    },
    onSuccess: (data) => {
      touchLocalCmsEdit();
      qc.setQueryData<MediaFile[]>(QK.media, (list) => upsertById(list, data));
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (file: MediaFile) => {
      await repos.media.delete(file);
    },
    onMutate: async (file) =>
      beginOptimisticUpdate<MediaFile[]>(qc, QK.media, (list) => removeById(list, file.id)),
    onError: (_err, _file, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.media, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

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

const BUCKET = "media";

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
  try {
    // Extract storage path from public URL
    const url = new URL(publicUrl);
    const pathMatch = url.pathname.match(/\/media\/(.+)/);
    if (!pathMatch) return;
    const storagePath = decodeURIComponent(pathMatch[1]);
    await supabase.storage.from(BUCKET).remove([storagePath]);
  } catch {
    // Silently fail — bucket cleanup is non-critical
  }
}

export function getMediaPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
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

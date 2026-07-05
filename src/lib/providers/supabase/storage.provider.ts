/**
 * Supabase implementation of IStorageProvider.
 * Wraps the Supabase Storage client behind the provider interface.
 */

import type { IStorageProvider, StorageUploadOptions } from "@/lib/interfaces/storage";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a storage provider backed by Supabase Storage.
 */
export function createSupabaseStorageProvider(
  supabase: SupabaseClient,
): IStorageProvider {
  return {
    async upload(
      bucket: string,
      path: string,
      file: File | Blob | ArrayBuffer,
      options?: StorageUploadOptions,
    ): Promise<{ error: unknown }> {
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        contentType: options?.contentType,
        upsert: options?.upsert,
      });
      return { error };
    },

    async remove(
      bucket: string,
      paths: string[],
    ): Promise<{ error: unknown }> {
      const { error } = await supabase.storage.from(bucket).remove(paths);
      return { error };
    },

    getPublicUrl(bucket: string, path: string): string {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    },
  };
}

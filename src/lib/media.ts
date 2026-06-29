import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { beginOptimisticUpdate, rollbackOptimisticUpdate, touchLocalCmsEdit, upsertById, removeById } from "./cms-sync";
import { QK } from "./test-db";

export type MediaFile = Database["public"]["Tables"]["media_files"]["Row"];

const BUCKET = "media";

export function getMediaPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export function useMediaFiles() {
  return useQuery({
    queryKey: QK.media,
    queryFn: async (): Promise<MediaFile[]> => {
      const { data, error } = await supabase.from("media_files").select("*").order("created_at", { ascending: false });
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

      const { data, error } = await supabase.from("media_files").insert({
        name: input.file.name,
        storage_path: storagePath,
        folder,
        tags: [],
        size_bytes: input.file.size,
        mime_type: input.file.type,
      }).select().single();
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
      const { error: storageError } = await supabase.storage.from(BUCKET).remove([file.storage_path]);
      if (storageError) throw storageError;
      const { error } = await supabase.from("media_files").delete().eq("id", file.id);
      if (error) throw error;
    },
    onMutate: async (file) => beginOptimisticUpdate<MediaFile[]>(qc, QK.media, (list) => removeById(list, file.id)),
    onError: (_err, _file, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.media, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

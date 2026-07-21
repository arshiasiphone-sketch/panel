/**
 * Media repository — encapsulates media_files table and storage operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { mediaFileSchema } from "@/lib/cms-schemas";
import { StorageError } from "@/lib/errors";

type MediaFileRow = Database["public"]["Tables"]["media_files"]["Row"];
type MediaFileInsert = Database["public"]["Tables"]["media_files"]["Insert"];

/**
 * Storage bucket for media files.
 * NOTE: When adding workspace support, include workspace ID in bucket name or path.
 */
export const MEDIA_BUCKET = "media";

/**
 * Internal folder convention for storage paths.
 * Structure: default/logo/, default/gallery/, default/events/, default/menu/
 * Future: {workspace-id}/logo/, {workspace-id}/gallery/
 */
export const MEDIA_FOLDER_PREFIX = "default" as const;

const SELECT_COLUMNS = "id,name,storage_path,folder,tags,size_bytes,mime_type,created_at" as const;

export class MediaRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(opts?: PaginatedOptions): Promise<MediaFileRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<MediaFileRow>("media_files")
          .select(SELECT_COLUMNS)
          .order("created_at", { ascending: false }),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("media_files", "getAll", err, { opts });
    }
  }

  /**
   * Upload a file to storage and record metadata.
   *
   * @param file - The file to upload
   * @param folder - Storage subfolder (default: "uploads").
   *   Convention: "{prefix}/{entity-type}" e.g. "default/gallery", "default/events"
   */
  async upload(file: File, folder = "uploads"): Promise<MediaFileRow> {
    const safeName = file.name.replace(/[^\w.\-()+\u0600-\u06FF]/g, "_");
    const storagePath = `${folder}/${crypto.randomUUID()}-${safeName}`;

    this.logger.info(`Uploading media`, { folder, fileName: file.name, size: file.size });

    const { error: uploadError } = await this.storage.upload(MEDIA_BUCKET, storagePath, file, {
      contentType: file.type,
    });
    if (uploadError) {
      throw new StorageError("upload", MEDIA_BUCKET, {
        cause: uploadError,
        context: { storagePath },
      });
    }

    try {
      const metadata = this.validateOrThrow(
        mediaFileSchema,
        {
          name: file.name,
          storage_path: storagePath,
          folder,
          tags: [],
          size_bytes: file.size,
          mime_type: file.type,
        },
        "media_files.upload",
      );

      const insertData = this.workspaceId ? { ...metadata, workspace_id: this.workspaceId } : metadata;
      const { data, error } = await this.withWorkspace(
        this.db
          .from<MediaFileRow>("media_files")
          .insert(insertData as MediaFileInsert)
          .select(),
      ).single();

      if (error) {
        // Clean up storage on DB failure
        this.logger.warn("DB insert failed, cleaning up storage", { storagePath, error });
        await this.storage.remove(MEDIA_BUCKET, [storagePath]);
        throw error;
      }

      return data;
    } catch (err) {
      throw this.normalizeError("media_files", "upload", err, { storagePath });
    }
  }

  async delete(file: MediaFileRow): Promise<void> {
    try {
      const { error: storageError } = await this.storage.remove(MEDIA_BUCKET, [file.storage_path]);
      if (storageError) {
        throw new StorageError("remove", MEDIA_BUCKET, {
          cause: storageError,
          context: { storagePath: file.storage_path },
        });
      }
      const { error } = await this.withWorkspace(
        this.db.from("media_files").delete().eq("id", file.id),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("media_files", "delete", err, { fileId: file.id });
    }
  }

  getPublicUrl(storagePath: string): string {
    return this.storage.getPublicUrl(MEDIA_BUCKET, storagePath);
  }

  async deleteByPublicUrl(publicUrl: string): Promise<void> {
    try {
      const url = new URL(publicUrl);
      const pathMatch = url.pathname.match(/\/media\/(.+)/);
      if (!pathMatch) return;
      const storagePath = decodeURIComponent(pathMatch[1]);
      await this.storage.remove(MEDIA_BUCKET, [storagePath]);
    } catch (err) {
      this.logger.warn("Failed to delete media by public URL", {
        publicUrl,
        cause: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

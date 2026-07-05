/**
 * Storage provider interface for abstracting file storage operations.
 * Supports Supabase Storage, S3, Cloudflare R2, local filesystem, etc.
 */

export interface StorageUploadOptions {
  contentType?: string;
  upsert?: boolean;
}

export interface IStorageProvider {
  /**
   * Upload a file to the specified bucket.
   */
  upload(
    bucket: string,
    path: string,
    file: File | Blob | ArrayBuffer,
    options?: StorageUploadOptions,
  ): Promise<{ error: unknown }>;

  /**
   * Remove files from the specified bucket.
   */
  remove(bucket: string, paths: string[]): Promise<{ error: unknown }>;

  /**
   * Get the public URL for a file in the specified bucket.
   */
  getPublicUrl(bucket: string, path: string): string;

  /**
   * Get a signed URL for temporary access to a private file.
   */
  getSignedUrl?(
    bucket: string,
    path: string,
    expiresIn?: number,
  ): Promise<{ data?: { signedUrl: string }; error: unknown }>;

  /**
   * Copy a file within the bucket.
   */
  copy?(bucket: string, from: string, to: string): Promise<{ error: unknown }>;

  /**
   * Move a file within the bucket.
   */
  move?(bucket: string, from: string, to: string): Promise<{ error: unknown }>;
}

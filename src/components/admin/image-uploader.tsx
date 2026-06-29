/**
 * Reusable image upload control wired to Supabase Storage (`media` bucket).
 *
 * Composition:
 *   - drag-and-drop / click-to-pick → local preview
 *   - validateImageFile → compressImageIfLarge → useUploadMedia
 *   - on successful upload: replace preview with the public URL, call onChange
 *   - on remove: call deleteMediaByPublicUrl (silent no-op for legacy URLs)
 *
 * Caller is responsible for persisting the returned URL on the CMS row. This
 * component never touches the row itself.
 */
import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Loader2, RefreshCw, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import {
  ACCEPTED_IMAGE_MIMES,
  MAX_IMAGE_BYTES,
  compressImageIfLarge,
  deleteMediaByPublicUrl,
  getMediaPublicUrl,
  useUploadMedia,
  validateImageFile,
} from "@/lib/media";

export type ImageUploaderProps = {
  /** Current persisted image URL ("" = no image). */
  currentImage: string;
  /** Fired after a successful upload with the new public URL. */
  onUpload: (url: string) => void;
  /** Fired after the image is removed (publicly visible URL is cleared). */
  onRemove: () => void;
  /** Storage folder, e.g. "gallery", "menu", "hero". Defaults to "uploads". */
  folderName?: string;
  /** Override accepted MIME types. Defaults to the bucket's whitelist. */
  acceptedFormats?: readonly string[];
  /** Maximum file size in bytes. Defaults to MAX_IMAGE_BYTES (5 MB). */
  maxSize?: number;
  /** Disable all interactions. */
  disabled?: boolean;
  /** Field label rendered above the dropzone. */
  label?: string;
  /** Whether to render the preview thumbnail when an image is set. */
  preview?: boolean;
  /** Override the aspect ratio of the preview area. */
  aspect?: "square" | "video" | "auto";
  /** Extra className passed to the outer wrapper. */
  className?: string;
};

type UploadState =
  | { kind: "idle" }
  | { kind: "validating" }
  | { kind: "uploading"; localPreview: string }
  | { kind: "error"; message: string; lastFile: File | null }
  | { kind: "success" };

function aspectClass(aspect: ImageUploaderProps["aspect"]): string {
  if (aspect === "square") return "aspect-square";
  if (aspect === "video") return "aspect-video";
  return "aspect-[4/3]";
}

function friendlyUploadError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("network") || msg.includes("fetch"))
      return "اتصال شبکه قطع شد. دوباره تلاش کنید.";
    if (msg.includes("unauthorized") || msg.includes("jwt") || msg.includes("permission")) {
      return "اجازه آپلود ندارید. ابتدا وارد شوید.";
    }
    if (msg.includes("bucket")) return "فضای ذخیره‌سازی در دسترس نیست.";
    if (msg.includes("payload") || msg.includes("too large")) return "حجم فایل بیش از حد مجاز است.";
    if (msg.includes("mime") || msg.includes("type")) return "نوع فایل مجاز نیست.";
    if (msg.includes("duplicate")) return "این فایل قبلاً آپلود شده.";
    return err.message;
  }
  return "آپلود ناموفق بود.";
}

export const ImageUploader = memo(function ImageUploader({
  currentImage,
  onUpload,
  onRemove,
  folderName = "uploads",
  acceptedFormats = ACCEPTED_IMAGE_MIMES,
  maxSize = MAX_IMAGE_BYTES,
  disabled = false,
  label,
  preview = true,
  aspect = "auto",
  className,
}: ImageUploaderProps) {
  const upload = useUploadMedia();
  const [state, setState] = useState<UploadState>({ kind: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Revoke object URLs to avoid memory leaks.
  useEffect(() => {
    if (state.kind !== "uploading") return;
    const url = state.localPreview;
    return () => URL.revokeObjectURL(url);
  }, [state]);

  // Briefly show the "success" pulse, then settle.
  useEffect(() => {
    if (state.kind !== "success") return;
    const t = setTimeout(() => setState({ kind: "idle" }), 1200);
    return () => clearTimeout(t);
  }, [state]);

  const startUpload = useCallback(
    async (file: File) => {
      const validation = validateImageFile(file, maxSize);
      if (validation) {
        toast.error(validation.message);
        setState({ kind: "error", message: validation.message, lastFile: file });
        return;
      }
      setState({ kind: "validating" });
      let prepared: File;
      try {
        prepared = await compressImageIfLarge(file);
      } catch {
        prepared = file;
      }
      const localPreview = URL.createObjectURL(prepared);
      setState({ kind: "uploading", localPreview });
      try {
        const previousUrl = currentImage;
        const row = await upload.mutateAsync({ file: prepared, folder: folderName });
        const newUrl = getMediaPublicUrl(row.storage_path);
        onUpload(newUrl);
        // Replacement: delete the previous bucket object only after the new
        // upload (and onUpload) has succeeded. Failures here are non-fatal —
        // the new image is already live.
        if (previousUrl && previousUrl !== newUrl) {
          deleteMediaByPublicUrl(previousUrl).catch(() => {});
        }
        setState({ kind: "success" });
      } catch (err) {
        const message = friendlyUploadError(err);
        toast.error(message);
        setState({ kind: "error", message, lastFile: prepared });
      }
    },
    [currentImage, folderName, maxSize, onUpload, upload],
  );

  const onPick = useCallback(() => {
    if (disabled || state.kind === "uploading" || state.kind === "validating") return;
    inputRef.current?.click();
  }, [disabled, state.kind]);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) void startUpload(file);
    },
    [startUpload],
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) setIsDragging(false);
  }, []);
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) void startUpload(file);
    },
    [disabled, startUpload],
  );

  const retry = useCallback(() => {
    if (state.kind === "error" && state.lastFile) {
      void startUpload(state.lastFile);
    } else {
      onPick();
    }
  }, [onPick, startUpload, state]);

  const remove = useCallback(() => {
    if (!currentImage) return;
    const url = currentImage;
    onRemove();
    deleteMediaByPublicUrl(url).catch(() => {});
    setConfirmingRemove(false);
    setState({ kind: "idle" });
  }, [currentImage, onRemove]);

  const acceptAttr = acceptedFormats.join(",");
  const displayPreview = state.kind === "uploading" ? state.localPreview : currentImage || null;

  const showDropzone = !displayPreview || !preview;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-muted-foreground mb-1">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={acceptAttr}
        className="sr-only"
        onChange={onChangeInput}
        disabled={disabled || state.kind === "uploading" || state.kind === "validating"}
      />

      {showDropzone ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-busy={state.kind === "uploading" || state.kind === "validating" || undefined}
          onClick={onPick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPick();
            }
          }}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={[
            "relative flex flex-col items-center justify-center gap-2 rounded-2xl",
            "border border-dashed border-border bg-card/40 backdrop-blur-sm",
            "px-4 py-8 text-center transition outline-none",
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-foreground/40 hover:bg-card/70",
            "focus-visible:ring-2 focus-visible:ring-foreground/40",
            isDragging ? "border-foreground/60 bg-foreground/[0.06] scale-[1.01]" : "",
          ].join(" ")}
        >
          <AnimatePresence>
            {isDragging && (
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(159,18,57,0.08), rgba(212,175,55,0.08))",
                  boxShadow: "inset 0 0 0 1px rgba(159,18,57,0.35)",
                }}
              />
            )}
          </AnimatePresence>

          {state.kind === "uploading" || state.kind === "validating" ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <div className="text-xs">
                {state.kind === "validating" ? "در حال آماده‌سازی..." : "در حال آپلود..."}
              </div>
              <div className="w-32 h-1 rounded-full bg-muted overflow-hidden">
                <motion.span
                  className="block h-full bg-foreground/60"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  style={{ width: "40%" }}
                />
              </div>
            </div>
          ) : state.kind === "error" ? (
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs text-destructive max-w-xs">{state.message}</div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  retry();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
              >
                <RefreshCw className="h-3.5 w-3.5" /> تلاش دوباره
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-7 w-7" />
              <div className="text-sm font-medium text-foreground">
                {isDragging ? "تصویر را رها کنید" : "تصویر را بکشید یا کلیک کنید"}
              </div>
              <div className="text-[11px]">
                JPG / PNG / WEBP / GIF / SVG · حداکثر {(maxSize / (1024 * 1024)).toFixed(0)} مگابایت
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${aspectClass(aspect)}`}
        >
          <img
            src={displayPreview ?? ""}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* darken on hover so the controls read clearly */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition" />

          {state.kind === "uploading" && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-muted overflow-hidden">
              <motion.span
                className="block h-full bg-foreground"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                style={{ width: "40%" }}
              />
            </div>
          )}

          {state.kind === "success" && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center"
            >
              <span
                className="h-12 w-12 rounded-full grid place-items-center text-background"
                style={{ background: "rgba(34,197,94,0.95)" }}
              >
                ✓
              </span>
            </motion.div>
          )}

          <AnimatePresence>
            {isDragging && (
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ boxShadow: "inset 0 0 0 2px rgba(159,18,57,0.7)" }}
              />
            )}
          </AnimatePresence>

          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
            <button
              type="button"
              onClick={onPick}
              disabled={disabled || state.kind === "uploading" || state.kind === "validating"}
              className="inline-flex items-center gap-1 rounded-lg bg-background/95 backdrop-blur px-2.5 py-1 text-[11px] font-medium shadow hover:bg-background disabled:opacity-50"
              title="جایگزینی"
            >
              <UploadCloud className="h-3.5 w-3.5" /> جایگزینی
            </button>
            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              disabled={disabled || state.kind === "uploading"}
              className="inline-flex items-center gap-1 rounded-lg bg-background/95 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-rose-600 shadow hover:bg-background disabled:opacity-50"
              title="حذف"
            >
              <Trash2 className="h-3.5 w-3.5" /> حذف
            </button>
          </div>

          <AnimatePresence>
            {confirmingRemove && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center bg-background/85 backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-3 p-4 text-center">
                  <div className="text-xs font-medium">حذف این تصویر؟</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={remove}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-600 text-white px-3 py-1.5 text-xs hover:bg-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> حذف
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingRemove(false)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5" /> انصراف
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});

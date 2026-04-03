"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { uploadImage, deleteImage } from "@/lib/supabase/storage";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadProps {
  bucket: string;
  path: string;
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  bucket,
  path,
  value,
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `"${file.name}" is not a supported image format. Use JPEG, PNG, WebP, or GIF.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB).`;
    }
    return null;
  }

  async function processFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Validate all files first
    const errors: string[] = [];
    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (value.length + validFiles.length >= maxImages) {
        errors.push(`Maximum ${maxImages} images allowed.`);
        break;
      }
      const err = validateFile(file);
      if (err) {
        errors.push(err);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e));
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of validFiles) {
      const url = await uploadImage(bucket, path, file);
      if (url) {
        newUrls.push(url);
      } else {
        toast.error(`Failed to upload "${file.name}". Please try again.`);
      }
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    await processFiles(files);
  }

  async function removeImage(index: number) {
    const url = value[index];
    onChange(value.filter((_, i) => i !== index));
    // Clean up from storage in background
    deleteImage(bucket, url).catch(() => {
      // Storage deletion is best-effort; image is already removed from form
    });
  }

  // Drag-and-drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        await processFiles(files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, bucket, path, maxImages]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url} className="group relative h-24 w-24">
            <Image
              src={url}
              alt={`Upload ${i + 1}`}
              fill
              className="rounded-xl object-cover"
              sizes="96px"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      {value.length < maxImages && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            disabled={uploading}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-brand-dark px-6 py-8 transition-colors hover:border-brand-accent/30 hover:bg-brand-dark/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 text-brand-accent animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-white/30" />
            )}
            <span className="text-sm text-white/40">
              {uploading ? "Uploading..." : "Click or drag images here"}
            </span>
            <span className="text-xs text-white/25">
              JPEG, PNG, WebP, GIF — max 5MB each
            </span>
          </button>
          <p className="mt-2 text-xs text-white/30">
            {value.length}/{maxImages} images
          </p>
        </div>
      )}
    </div>
  );
}

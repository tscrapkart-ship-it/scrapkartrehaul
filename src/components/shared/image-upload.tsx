"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/supabase/storage";
import { Upload, X } from "lucide-react";

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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (value.length + newUrls.length >= maxImages) break;
      const url = await uploadImage(bucket, path, file);
      if (url) newUrls.push(url);
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

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
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-brand-dark px-6 py-8 transition-colors hover:border-brand-accent/30 hover:bg-brand-dark/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-6 w-6 text-white/30" />
            <span className="text-sm text-white/40">
              {uploading ? "Uploading..." : "Click or drag images here"}
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

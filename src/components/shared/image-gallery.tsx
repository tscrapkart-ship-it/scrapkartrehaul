"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function ImageGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);
  const [loaded, setLoaded] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-[#262626] bg-[#141414]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626] mb-3">
          <ImageIcon className="h-8 w-8 text-[#525252]" />
        </div>
        <p className="text-base text-[#525252] font-medium">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#262626] bg-[#0A0A0A]">
        {/* Loading pulse */}
        {!loaded && (
          <div className="absolute inset-0 z-10 animate-pulse bg-[#1A1A1A]" />
        )}

        <Image
          key={images[selected]}
          src={images[selected]}
          alt={`Image ${selected + 1}`}
          fill
          className={`object-cover transition-all duration-500 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          sizes="(max-width: 768px) 100vw, 55vw"
          priority
          onLoad={() => setLoaded(true)}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => { setLoaded(false); setSelected((s) => (s - 1 + images.length) % images.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => { setLoaded(false); setSelected((s) => (s + 1) % images.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2.5 py-1 text-sm font-medium text-white/80 backdrop-blur-sm">
            {selected + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => { setLoaded(false); setSelected(i); }}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                i === selected
                  ? "border-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={url} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export function ImageGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#002a47]">
        <ImageIcon className="h-10 w-10 text-white/20" />
        <p className="mt-2 text-sm text-white/30">No images</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#002a47]">
        <Image
          src={images[selected]}
          alt={`Image ${selected + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-xl transition-all ${
                i === selected
                  ? "ring-2 ring-brand-accent ring-offset-2 ring-offset-brand-dark"
                  : "opacity-50 hover:opacity-80"
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

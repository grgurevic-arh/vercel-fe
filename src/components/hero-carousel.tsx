'use client';

import Image from "next/image";
import { useState } from "react";

export interface HeroCarouselItem {
  url: string;
  alt: string;
  width: number;
  height: number;
  description: string | null;
}

interface HeroCarouselProps {
  items: HeroCarouselItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) {
    return null;
  }

  const itemCount = items.length;
  const clampedIndex = Math.min(Math.max(activeIndex, 0), itemCount - 1);
  const activeItem = items[clampedIndex];

  const goTo = (index: number) => {
    const nextIndex = (index + itemCount) % itemCount;
    setActiveIndex(nextIndex);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Image
          src={activeItem.url}
          alt={activeItem.alt}
          width={activeItem.width}
          height={activeItem.height}
          sizes="(min-width: 768px) 60vw, 100vw"
          className="h-auto w-full max-w-3xl rounded"
          priority={clampedIndex === 0}
        />

        {itemCount > 1 ? (
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2">
            <button
              type="button"
              onClick={() => goTo(clampedIndex - 1)}
              aria-label="Previous image"
              className="rounded-full bg-white/80 px-2 py-1 text-base font-semibold text-gray-700 shadow hover:bg-white"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={() => goTo(clampedIndex + 1)}
              aria-label="Next image"
              className="rounded-full bg-white/80 px-2 py-1 text-base font-semibold text-gray-700 shadow hover:bg-white"
            >
              {">"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="space-y-1 text-center">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Image {clampedIndex + 1} / {itemCount}
        </p>
        {activeItem.description ? (
          <p className="text-sm text-gray-600">{activeItem.description}</p>
        ) : null}
      </div>

      {itemCount > 1 ? (
        <div className="flex justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={`${item.url}-${index}`}
              type="button"
              className={`h-2 w-2 rounded-full ${index === clampedIndex ? "bg-gray-900" : "bg-gray-300"}`}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

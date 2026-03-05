"use client";

import Image from "next/image";
import { useState } from "react";

export interface CarouselSlide {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface HomepageCarouselProps {
  slides: CarouselSlide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) return null;

  const current = slides[Math.min(activeIndex, slides.length - 1)];

  return (
    <section>
      {/* Full-width image */}
      <div
        className="
          relative w-full overflow-hidden
          h-[300px] md:h-[632px] xl:h-[810px]
        "
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Number pagination */}
      <nav
        className="
          flex
          mt-[16px] md:mt-[28px] lg:mt-[28px] xl:mt-[33px]
          pl-[12px] md:pl-[44px] lg:pl-[39px] xl:pl-[88px]
          gap-[34px] md:gap-[35px] lg:gap-[14px] xl:gap-[24px]
        "
        aria-label="Image pagination"
      >
        {slides.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              className={`
                text-[16px] leading-[23px] text-text-primary
                w-[46px] md:w-auto
                text-left
                ${isActive ? "underline" : ""}
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </nav>
    </section>
  );
}

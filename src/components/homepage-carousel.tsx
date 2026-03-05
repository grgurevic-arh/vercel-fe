"use client";

import Image from "next/image";
import { useState } from "react";

export interface CarouselSlide {
  url: string;
  alt: string;
  width: number;
  height: number;
  description?: string | null;
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

      {/* Caption + Number pagination row */}
      <div
        className="
          flex items-baseline justify-between
          mt-[16px] md:mt-[28px] lg:mt-[28px] xl:mt-[33px]
          px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        "
      >
        {current.description ? (
          <p
            className="
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
              flex-1 min-w-0 mr-[24px]
            "
          >
            {current.description}
          </p>
        ) : (
          <span />
        )}

        {slides.length > 1 ? (
          <nav
            className="flex shrink-0 gap-[14px] md:gap-[24px]"
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
                    ${isActive ? "underline" : ""}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </nav>
        ) : null}
      </div>
    </section>
  );
}

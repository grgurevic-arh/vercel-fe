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
          h-[300px] md:h-[632px] xl:h-[max(810px,56.25vw)]
        "
      >
        <div
          className="flex h-full transition-transform duration-[1500ms] ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.url} className="relative h-full w-full shrink-0">
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination + Caption */}
      <div
        className="
          content-wrapper
          mt-[16px] md:mt-[28px] lg:mt-[28px] xl:mt-[33px]
          px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        "
      >
        {slides.length > 1 ? (
          <nav
            className="flex gap-[24px]"
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
                    text-left
                    text-[16px] leading-[23px] text-text-primary
                    [font-feature-settings:'onum'_1,'pnum'_1]
                    link-underline
                    cursor-pointer
                    ${isActive ? "link-underline-active" : ""}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </nav>
        ) : null}

        {current.description ? (
          <p
            className="
              mt-[12px]
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
            "
          >
            {current.description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

import type { CarouselSlide } from "@/components/homepage-carousel";

interface ProjectHeroCarouselProps {
  slides: CarouselSlide[];
}

export function ProjectHeroCarousel({ slides }: ProjectHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) return null;

  const current = slides[Math.min(activeIndex, slides.length - 1)];

  return (
    <section className="content-wrapper pt-[138px] lg:pt-[144px] xl:pt-[152px]">
      {/* Hero image — inset from left, NOT full-width */}
      <div
        className="
          relative overflow-hidden
          w-full md:w-[680px] lg:w-[824px] xl:w-[944px]
          h-[208px] md:h-[440px] lg:h-[531px] xl:h-[608px]
          ml-0 md:ml-[44px] lg:ml-[100px] xl:ml-[248px]
        "
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="(min-width: 1440px) 944px, (min-width: 1024px) 824px, (min-width: 768px) 680px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Caption + Pagination row */}
      <div
        className="
          flex justify-between items-baseline
          mt-[8px] md:mt-[12px]
          pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
          pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
        "
      >
        {/* Caption */}
        {current.description ? (
          <p
            className="
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
            "
          >
            {current.description}
          </p>
        ) : <span />}

        {/* Pagination numbers */}
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
                    text-[16px] leading-[23px] text-text-primary
                    [font-feature-settings:'onum'_1,'pnum'_1]
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

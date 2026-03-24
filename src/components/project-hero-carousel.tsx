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
          ml-0 md:mx-auto xl:mx-0 xl:ml-[248px]
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
          flex justify-start md:justify-between items-baseline
          mt-[12px] lg:mt-[8px]
          pl-[12px] md:pl-0 xl:pl-[248px]
          w-full md:w-[680px] lg:w-[824px] xl:w-[calc(248px+944px)]
          md:mx-auto xl:mx-0
        "
      >
        {/* Caption */}
        {current.description ? (
          <p
            className="
              hidden md:block
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
            "
          >
            {current.description}
          </p>
        ) : <span className="hidden md:inline" />}

        {/* Pagination numbers */}
        {slides.length > 1 ? (
          <nav
            className="flex gap-[32px]"
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
                    [text-decoration-skip-ink:none]
                    ${isActive ? "underline underline-offset-[4px]" : ""}
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

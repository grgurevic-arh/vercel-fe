import Image from "next/image";

import { BlocksRenderer } from "@/components/blocks-renderer";
import { BorderedSection } from "@/components/bordered-section";
import type { CarouselSlide } from "@/components/homepage-carousel";
import { ProjectHeroCarousel } from "@/components/project-hero-carousel";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { ProjectDetail, StrapiMedia } from "@/types/cms";

interface ProjectDetailContentProps {
  project: ProjectDetail;
  locale: string;
  titleFallback: string;
}

/* ------------------------------------------------------------------ */
/*  Hero carousel builder                                             */
/* ------------------------------------------------------------------ */

const buildHeroSlides = (project: ProjectDetail): CarouselSlide[] => {
  return (project.heroImages ?? []).reduce<CarouselSlide[]>((acc, entry) => {
    const attrs = getStrapiMediaAttributes(entry.image);
    const url = getStrapiMediaUrl(entry.image);
    if (!url) return acc;

    acc.push({
      url,
      alt: attrs?.alternativeText ?? `${project.title ?? "Project"} hero`,
      width: attrs?.width ?? 1600,
      height: attrs?.height ?? 900,
      description: entry.description ?? null,
    });

    return acc;
  }, []);
};

/* ------------------------------------------------------------------ */
/*  Meta grid builder                                                 */
/* ------------------------------------------------------------------ */

const buildMetaPairs = (project: ProjectDetail, locale: string) => {
  const hr = locale === "hr";
  return [
    { label: hr ? "Lokacija" : "Location", value: project.location },
    { label: "Status", value: project.projectStatus },
    { label: hr ? "Završeno" : "Completed", value: project.completed },
    { label: hr ? "Veličina" : "Size", value: project.size },
    { label: hr ? "Investitor" : "Investor", value: project.investor },
    { label: hr ? "Trajanje" : "Duration", value: project.projectLength },
    { label: hr ? "Površina" : "Site Area", value: project.siteArea },
    { label: hr ? "Investicija" : "Investment", value: project.investmentValue },
  ].filter((field) => field.value);
};

/* ------------------------------------------------------------------ */
/*  Composition image helpers                                         */
/* ------------------------------------------------------------------ */

/**
 * Deterministic pseudo-random side based on index and slug.
 * Returns "left" or "right" — varied but stable across renders.
 */
function getImageSide(index: number, slug: string): "left" | "right" {
  let hash = 0;
  const seed = `${slug}-${index}`;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return hash % 2 === 0 ? "left" : "right";
}

function CompositionImage({
  media,
  alt,
  caption,
  side,
}: {
  media: StrapiMedia;
  alt: string;
  caption: string | null;
  side: "left" | "right";
}) {
  const attrs = getStrapiMediaAttributes(media);
  const url = getStrapiMediaUrl(media);
  if (!url) return null;

  const width = attrs?.width ?? 1600;
  const height = attrs?.height ?? 900;

  const alignmentClass =
    side === "left"
      ? "mr-auto ml-0"
      : "ml-auto mr-0";

  return (
    <figure
      className="
        content-wrapper
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        mb-[40px] md:mb-[60px] lg:mb-[80px]
      "
    >
      <div className={`w-full md:w-[70%] lg:w-[60%] ${alignmentClass}`}>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 60vw, (min-width: 768px) 70vw, 100vw"
          className="h-auto w-full"
        />
        {caption ? (
          <figcaption
            className="
              mt-[8px] md:mt-[12px]
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
            "
          >
            {caption}
          </figcaption>
        ) : null}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function ProjectDetailContent({
  project,
  locale,
  titleFallback,
}: ProjectDetailContentProps) {
  const heroSlides = buildHeroSlides(project);
  const heading = project.title ?? titleFallback;
  const metaPairs = buildMetaPairs(project, locale);
  const siteImages = project.siteImages ?? [];
  const floorPlans = project.floorPlans ?? [];
  const slug = project.slug;

  return (
    <>
      {/* Hero carousel */}
      {heroSlides.length ? (
        <ProjectHeroCarousel slides={heroSlides} />
      ) : null}

      {/* Title */}
      <h1
        className="
          content-wrapper
          pt-[32px] md:pt-[40px] lg:pt-[48px]
          pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
          pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
          pb-[24px] md:pb-[32px]
          text-[20px] leading-[28px]
          md:text-[28px] md:leading-[38px]
          text-text-primary
        "
      >
        {heading}
      </h1>

      {/* Project code */}
      {project.projectCode ? (
        <p
          className="
            content-wrapper
            pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
            pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
            pb-[16px] md:pb-[20px]
            text-[16px] leading-[23px] text-text-primary uppercase tracking-wide
          "
        >
          {project.projectCode}
        </p>
      ) : null}

      {/* Description */}
      {project.description && Array.isArray(project.description) && project.description.length > 0 ? (
        <div
          className="
            content-wrapper
            pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
            pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
            pb-[40px] md:pb-[48px] lg:pb-[56px]
            max-w-[296px] md:max-w-[680px] lg:max-w-[824px] xl:max-w-[864px]
          "
        >
          <BlocksRenderer
            content={project.description}
            className="
              text-[16px] leading-[23px]
              [font-feature-settings:'onum'_1,'pnum'_1]
              text-text-primary
              [&>p]:mb-[16px] [&>p:last-child]:mb-0
            "
          />
        </div>
      ) : null}

      {/* Meta grid */}
      {metaPairs.length ? (
        <section
          className="
            pb-[40px] md:pb-[60px] lg:pb-[80px]
          "
        >
          <BorderedSection border="border-t border-divider" className="px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]">
            {(() => {
              const rows: Array<typeof metaPairs> = [];
              for (let i = 0; i < metaPairs.length; i += 2) {
                rows.push(metaPairs.slice(i, i + 2));
              }
              return rows.map((row, rowIndex) => (
                <BorderedSection
                  key={rowIndex}
                  border="border-b border-divider"
                  className="
                    grid grid-cols-1 md:grid-cols-2
                    gap-x-[40px] lg:gap-x-[80px]
                    py-[12px] md:py-[16px]
                  "
                >
                  {row.map((pair) => (
                    <div key={pair.label} className="flex gap-x-[24px] md:gap-x-[40px]">
                      <span className="shrink-0 w-[120px] md:w-[140px] uppercase text-[16px] leading-[23px] text-text-primary tracking-wide">
                        {pair.label}
                      </span>
                      <span className="text-[16px] leading-[23px] text-text-primary">
                        {pair.value}
                      </span>
                    </div>
                  ))}
                </BorderedSection>
              ));
            })()}
          </BorderedSection>
        </section>
      ) : null}

      {/* Site images — composition layout */}
      {siteImages.length ? (
        <section className="mt-[20px] md:mt-[40px]">
          {siteImages.map((siteImage, index) => {
            const attrs = getStrapiMediaAttributes(siteImage.image);
            const alt =
              attrs?.alternativeText ?? `${heading} site image ${index + 1}`;
            const side = getImageSide(index, slug);

            return (
              <CompositionImage
                key={`site-${index}`}
                media={siteImage.image}
                alt={alt}
                caption={siteImage.description}
                side={side}
              />
            );
          })}
        </section>
      ) : null}

      {/* Floor plans — same composition layout */}
      {floorPlans.length ? (
        <section className="mt-[20px] md:mt-[40px]">
          {floorPlans.map((floorPlan, index) => {
            const attrs = getStrapiMediaAttributes(floorPlan.plan);
            const alt =
              attrs?.alternativeText ?? `${heading} floor plan ${index + 1}`;
            const side = getImageSide(index + siteImages.length, slug);

            return (
              <CompositionImage
                key={`floor-${index}`}
                media={floorPlan.plan}
                alt={alt}
                caption={floorPlan.label}
                side={side}
              />
            );
          })}
        </section>
      ) : null}
    </>
  );
}

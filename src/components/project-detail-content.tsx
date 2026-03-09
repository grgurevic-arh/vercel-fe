import Image from "next/image";

import { BlocksRenderer } from "@/components/blocks-renderer";
import { HomepageCarousel, type CarouselSlide } from "@/components/homepage-carousel";
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
        <HomepageCarousel slides={heroSlides} />
      ) : null}

      {/* Title */}
      <h1
        className="
          pt-[32px] md:pt-[40px] lg:pt-[48px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[24px] md:pb-[32px]
          text-[20px] leading-[28px]
          min-[320px]:text-[28px] min-[320px]:leading-[38px]
          md:text-[38px] md:leading-[50px]
          text-text-primary
        "
      >
        {heading}
      </h1>

      {/* Project code */}
      {project.projectCode ? (
        <p
          className="
            pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
            pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
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
            pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
            pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
            pb-[40px] md:pb-[48px] lg:pb-[56px]
          "
        >
          <BlocksRenderer
            content={project.description}
            className="
              text-[16px] leading-[23px]
              [font-feature-settings:'onum'_1,'pnum'_1]
              min-[320px]:text-[20px] min-[320px]:leading-[28px]
              md:text-[22px] md:leading-[32px]
              lg:text-[28px] lg:leading-[38px]
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
            px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
            pb-[40px] md:pb-[60px] lg:pb-[80px]
          "
        >
          <div className="border-t border-divider">
            {(() => {
              const rows: Array<typeof metaPairs> = [];
              for (let i = 0; i < metaPairs.length; i += 2) {
                rows.push(metaPairs.slice(i, i + 2));
              }
              return rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="
                    grid grid-cols-1 md:grid-cols-2
                    gap-x-[40px] lg:gap-x-[80px]
                    border-b border-divider
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
                </div>
              ));
            })()}
          </div>
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

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
    {
      label: hr ? "Investicija" : "Investment",
      value: project.investmentValue,
    },
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
  variant = "photo",
}: {
  media: StrapiMedia;
  alt: string;
  caption: string | null;
  side: "left" | "right";
  variant?: "photo" | "plan";
}) {
  const attrs = getStrapiMediaAttributes(media);
  const url = getStrapiMediaUrl(media);
  if (!url) return null;

  const width = attrs?.width ?? 1600;
  const height = attrs?.height ?? 900;
  const isPortrait = height >= width;

  let widthClass: string;
  let sizes: string;

  if (variant === "plan") {
    // Floor plans render at natural size, capped at content area width
    // They don't stretch to fill — they maintain natural proportions
    widthClass = "w-full md:max-w-[680px] lg:max-w-[824px] xl:max-w-[944px]";
    sizes =
      "(min-width: 1440px) 944px, (min-width: 1024px) 824px, (min-width: 768px) 680px, 100vw";
  } else if (isPortrait) {
    widthClass = "w-full md:w-[340px] lg:w-[412px] xl:w-[472px]";
    sizes =
      "(min-width: 1440px) 472px, (min-width: 1024px) 412px, (min-width: 768px) 340px, 100vw";
  } else {
    widthClass = "w-full md:w-[680px] lg:w-[824px] xl:w-[944px]";
    sizes =
      "(min-width: 1440px) 944px, (min-width: 1024px) 824px, (min-width: 768px) 680px, 100vw";
  }

  // Alignment: portrait photos and plans stick to left or right edge
  const alignmentClass =
    variant === "plan" || isPortrait
      ? side === "left"
        ? ""
        : "md:ml-auto"
      : "";

  return (
    <figure
      className="
        content-wrapper
        pl-0 md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
        pr-0 md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
        mb-[45px] md:mb-[69px] lg:mb-[69px] xl:mb-[95px]
      "
    >
      <div className={`${widthClass} ${alignmentClass}`}>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
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
      {heroSlides.length ? <ProjectHeroCarousel slides={heroSlides} /> : null}

      {/* Title */}
      <h1
        className="
          content-wrapper
          pt-[99px] md:pt-[81px] lg:pt-[80px] xl:pt-[145px]
          pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
          pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
          pb-[10px] md:pb-[24px] xl:pb-[27px]
          text-[20px] leading-[28px]
          md:text-[28px] md:leading-[38px] lg:text-[38px] lg:leading-[50px]
          text-text-primary
        "
      >
        {heading}
      </h1>

      {/* Description */}
      {project.description &&
      Array.isArray(project.description) &&
      project.description.length > 0 ? (
        <div
          className="
            content-wrapper
            pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
            pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
            pb-[46px] md:pb-[114px] lg:pb-[134px]
          "
        >
          <div className="md:max-w-[680px] lg:max-w-[824px] xl:max-w-[864px]">
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
        </div>
      ) : null}

      {/* Meta grid */}
      {metaPairs.length ? (
        <section className="pb-[176px]">
          <div className="border-t border-divider">
            {(() => {
              const rows: Array<typeof metaPairs> = [];
              for (let i = 0; i < metaPairs.length; i += 2) {
                rows.push(metaPairs.slice(i, i + 2));
              }
              return rows.map((row, rowIndex) => (
                <BorderedSection
                  key={rowIndex}
                  border="border-b border-divider"
                  className={`
                    grid grid-cols-1 md:grid-cols-2
                    md:h-[70px] lg:h-[90px] xl:h-[80px]
                  `}
                >
                  {row.map((pair, i) => (
                    <div
                      key={pair.label}
                      className={`
                        flex flex-col lg:flex-row lg:items-center
                        py-[12px] md:py-[12px] lg:py-0 xl:py-0
                        pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                        pr-[12px] md:pr-[20px]
                        ${i === 0 && row.length > 1 ? "border-b border-divider md:border-b-0" : ""}
                      `}
                    >
                      <span
                        className="
                          shrink-0 lowercase [font-variant-caps:small-caps]
                          text-[16px] leading-[22px] tracking-[0.48px]
                          text-text-primary
                          [font-feature-settings:'onum'_1,'pnum'_1]
                          lg:w-[130px] xl:w-[150px]
                        "
                      >
                        {pair.label}
                      </span>
                      <span
                        className="
                          text-[16px] leading-[23px] text-text-primary
                          [font-feature-settings:'onum'_1,'pnum'_1]
                        "
                      >
                        {pair.value}
                      </span>
                    </div>
                  ))}
                </BorderedSection>
              ));
            })()}
          </div>
        </section>
      ) : null}

      {/* Site images — composition layout */}
      {siteImages.length ? (
        <section>
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
        <section>
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
                variant="plan"
              />
            );
          })}
        </section>
      ) : null}
    </>
  );
}

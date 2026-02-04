import Image from "next/image";

import { HeroCarousel, type HeroCarouselItem } from "@/components/hero-carousel";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { ProjectDetail } from "@/types/cms";

interface ProjectDetailContentProps {
  project: ProjectDetail;
  titleFallback: string;
}

const buildHeroItems = (project: ProjectDetail): HeroCarouselItem[] => {
  return (project.heroImages ?? []).reduce<HeroCarouselItem[]>((acc, entry) => {
    const mediaAttributes = getStrapiMediaAttributes(entry.image);
    const mediaUrl = getStrapiMediaUrl(entry.image);
    if (!mediaUrl) {
      return acc;
    }

    acc.push({
      url: mediaUrl,
      alt:
        mediaAttributes?.alternativeText ??
        (project.title ? `${project.title} hero` : "Hero image"),
      width: mediaAttributes?.width ?? 1600,
      height: mediaAttributes?.height ?? 900,
      description: entry.description ?? null,
    });

    return acc;
  }, []);
};

const buildMetaSections = (project: ProjectDetail) => {
  return [
    { label: "Status", value: project.status },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year?.toString() },
    { label: "Size", value: project.size },
    { label: "Completed", value: project.completed },
    { label: "Gross area", value: project.grossArea },
    { label: "Investor", value: project.investor },
    { label: "Project code", value: project.projectCode },
    { label: "Site area", value: project.siteArea },
    { label: "Investment value", value: project.investmentValue },
    { label: "Program", value: project.program },
  ].filter((field) => field.value);
};

export function ProjectDetailContent({
  project,
  titleFallback,
}: ProjectDetailContentProps) {
  const heroItems = buildHeroItems(project);
  const heading = project.title ?? titleFallback;
  const metaSections = buildMetaSections(project);
  const siteImages = project.siteImages ?? [];
  const floorPlans = project.floorPlans ?? [];

  return (
    <>
      {heroItems.length ? (
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Hero images
          </p>
          <HeroCarousel items={heroItems} />
        </section>
      ) : null}

      <section className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-gray-500">Heading</p>
        <h1 className="text-3xl font-semibold text-gray-900">{heading}</h1>
      </section>

      <section className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Description
        </p>
        {project.description ? (
          <div className="whitespace-pre-line text-base leading-relaxed text-gray-900">
            {project.description}
          </div>
        ) : (
          <p className="text-base text-gray-500">No description provided.</p>
        )}
      </section>

      {metaSections.length ? (
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Project details
          </p>
          <dl className="grid gap-4 md:grid-cols-2">
            {metaSections.map((field) => (
              <div key={field.label} className="rounded border border-gray-200 p-4">
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  {field.label}
                </dt>
                <dd className="mt-1 text-base text-gray-900">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {siteImages.length ? (
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Site images
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {siteImages.map((siteImage, index) => {
              const siteMediaAttributes = getStrapiMediaAttributes(siteImage.image);
              const siteUrl = getStrapiMediaUrl(siteImage.image);
              if (!siteUrl) {
                return null;
              }

              const siteAlt =
                siteMediaAttributes?.alternativeText ??
                (project.title ? `${project.title} site image` : "Site image");

              return (
                <figure key={`${siteUrl}-${index}`} className="space-y-2">
                  <Image
                    src={siteUrl}
                    alt={siteAlt}
                    width={siteMediaAttributes?.width ?? 1600}
                    height={siteMediaAttributes?.height ?? 900}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="h-auto w-full rounded"
                  />
                  {siteImage.description ? (
                    <figcaption className="text-sm text-gray-600">
                      {siteImage.description}
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
          </div>
        </section>
      ) : null}

      {floorPlans.length ? (
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Floor plans
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {floorPlans.map((floorPlan, index) => {
              const floorMediaAttributes = getStrapiMediaAttributes(
                floorPlan.plan,
              );
              const floorUrl = getStrapiMediaUrl(floorPlan.plan);
              if (!floorUrl) {
                return null;
              }

              const floorAlt =
                floorMediaAttributes?.alternativeText ??
                (floorPlan.label ? `${floorPlan.label} floor plan` : "Floor plan");

              return (
                <figure key={`${floorUrl}-${index}`} className="space-y-2">
                  <Image
                    src={floorUrl}
                    alt={floorAlt}
                    width={floorMediaAttributes?.width ?? 1600}
                    height={floorMediaAttributes?.height ?? 900}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="h-auto w-full rounded"
                  />
                  {floorPlan.label ? (
                    <figcaption className="text-sm text-gray-600">
                      {floorPlan.label}
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}

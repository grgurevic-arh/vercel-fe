import Image from "next/image";
import Link from "next/link";

import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { NormalizedProjectListing } from "@/lib/project-helpers";

interface ProjectGalleryProps {
  locale: string;
  projects: NormalizedProjectListing[];
}

function isLandscape(project: NormalizedProjectListing): boolean {
  const heroMedia = project.heroImages?.[0]?.image;
  const attrs = getStrapiMediaAttributes(heroMedia);
  if (!attrs?.width || !attrs?.height) return true;
  return attrs.width / attrs.height > 1.2;
}

interface GalleryRow {
  type: "pair" | "single";
  projects: NormalizedProjectListing[];
}

function buildGalleryRows(projects: NormalizedProjectListing[]): GalleryRow[] {
  const rows: GalleryRow[] = [];
  let i = 0;

  while (i < projects.length) {
    const current = projects[i];
    const next = projects[i + 1];

    if (next && isLandscape(current) && isLandscape(next)) {
      rows.push({ type: "pair", projects: [current, next] });
      i += 2;
    } else {
      rows.push({ type: "single", projects: [current] });
      i += 1;
    }
  }

  return rows;
}

function GalleryItem({
  project,
  locale,
}: {
  project: NormalizedProjectListing;
  locale: string;
}) {
  const firstHero = project.heroImages?.[0];
  const heroMedia = firstHero?.image;
  const coverAttributes = getStrapiMediaAttributes(heroMedia);
  const coverUrl = getStrapiMediaUrl(heroMedia);
  const coverWidth = coverAttributes?.width ?? 1200;
  const coverHeight = coverAttributes?.height ?? 900;
  const coverAlt =
    coverAttributes?.alternativeText ?? `${project.title} cover image`;
  const href = `/${locale}/work/${project.slug}`;

  return (
    <Link
      href={href}
      className="
        group block
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-black
      "
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={coverAlt}
          width={coverWidth}
          height={coverHeight}
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-[16px] text-text-primary">
          No cover image
        </div>
      )}
      <p
        className="
          mt-[12px] md:mt-[16px]
          text-[16px] leading-[23px] text-text-primary
        "
      >
        {project.title}
      </p>
    </Link>
  );
}

export function ProjectGallery({ locale, projects }: ProjectGalleryProps) {
  if (!projects.length) return null;

  const rows = buildGalleryRows(projects);

  return (
    <section
      className="
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        pt-[80px] md:pt-[100px] lg:pt-[120px] xl:pt-[140px]
        space-y-[40px] md:space-y-[60px] lg:space-y-[80px]
      "
    >
      {rows.map((row, rowIndex) => {
        if (row.type === "pair") {
          return (
            <div
              key={`row-${rowIndex}`}
              className="grid grid-cols-2 gap-[24px] md:gap-[40px] lg:gap-[48px]"
            >
              {row.projects.map((project) => (
                <GalleryItem
                  key={`${project.slug}-${project.id}`}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          );
        }

        return (
          <div
            key={`row-${rowIndex}`}
            className="flex justify-center"
          >
            <div className="w-full md:w-[60%] lg:w-[50%]">
              <GalleryItem
                project={row.projects[0]}
                locale={locale}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}

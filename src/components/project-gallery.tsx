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
      <div className="md:max-w-[448px] lg:max-w-[396px] mx-auto">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverAlt}
            width={coverWidth}
            height={coverHeight}
            sizes="(min-width: 1024px) 396px, (min-width: 768px) 448px, 100vw"
            className="h-auto w-full"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-[16px] text-text-primary">
            No cover image
          </div>
        )}
      </div>
      <p
        className="
          mt-[12px] md:mt-[16px]
          text-[16px] leading-[23px] md:text-[20px] md:leading-[28px]
          text-text-primary
          [font-feature-settings:'onum'_1,'pnum'_1]
          pl-[12px] md:pl-0
          truncate
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
        content-wrapper
        px-0 md:px-0 lg:px-[40px] xl:px-[248px]
        pt-[182px] md:pt-[160px] lg:pt-[208px] xl:pt-[208px]
        space-y-[52px] md:space-y-[32px] lg:space-y-[40px]
      "
    >
      {/* Mobile + md layout (stacked, shown below lg) */}
      <div className="lg:hidden space-y-[52px] md:space-y-[32px]">
        {projects.map((project) => (
          <div key={`${project.slug}-${project.id}`} className="md:mx-auto md:w-[564px]">
            <GalleryItem project={project} locale={locale} />
          </div>
        ))}
      </div>

      {/* lg+ layout (paired grid) */}
      <div className="hidden lg:block space-y-[40px]">
        {rows.map((row, rowIndex) => {
          if (row.type === "pair") {
            return (
              <div
                key={`row-${rowIndex}`}
                className="grid grid-cols-2 gap-[16px]"
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
              <div className="w-[464px]">
                <GalleryItem
                  project={row.projects[0]}
                  locale={locale}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

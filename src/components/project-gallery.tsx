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
  portrait,
}: {
  project: NormalizedProjectListing;
  locale: string;
  portrait: boolean;
}) {
  const firstHero = project.heroImages?.[0];
  const heroMedia = firstHero?.image;
  const coverAttributes = getStrapiMediaAttributes(heroMedia);
  const coverUrl = getStrapiMediaUrl(heroMedia);
  const coverAlt =
    coverAttributes?.alternativeText ?? `${project.title} cover image`;
  const href = `/${locale}/work/${project.slug}`;

  const containerHeight = portrait
    ? "md:h-[677px] lg:h-[448px]"
    : "md:h-[598px] lg:h-[448px]";

  return (
    <Link
      href={href}
      className="
        group block
        focus-visible:outline
        focus-visible:outline-offset-2 focus-visible:outline-black
      "
    >
      <div className={`flex flex-col ${containerHeight}`}>
        {coverUrl ? (
          <>
            {/* Mobile: natural image sizing, no fixed container */}
            <div className="md:hidden">
              <Image
                src={coverUrl}
                alt={coverAlt}
                width={coverAttributes?.width ?? 1200}
                height={coverAttributes?.height ?? 900}
                sizes="320px"
                className="w-full h-auto"
              />
            </div>
            {/* md+: fixed container with padding and centered image */}
            <div className="relative flex-1 min-h-0 overflow-hidden hidden md:block">
              <div className="absolute inset-[24px]">
                <div className="relative h-full w-full">
                  <Image
                    src={coverUrl}
                    alt={coverAlt}
                    fill
                    sizes="(min-width: 1024px) 416px, (min-width: 768px) 516px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 min-h-0 items-center justify-center bg-gray-100 text-[16px] text-text-primary md:h-full">
            No cover image
          </div>
        )}
        <p
          className="
            mt-[16px]
            text-[16px] leading-[23px] md:text-[20px] md:leading-[28px]
            text-text-primary
            [font-feature-settings:'onum'_1,'pnum'_1]
            pl-[12px] md:pl-0
            truncate
          "
        >
          {project.title}
        </p>
      </div>
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
          <div
            key={`${project.slug}-${project.id}`}
            className="md:mx-auto md:w-[564px]"
          >
            <GalleryItem project={project} locale={locale} portrait={!isLandscape(project)} />
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
                    portrait={!isLandscape(project)}
                  />
                ))}
              </div>
            );
          }

          return (
            <div key={`row-${rowIndex}`} className="flex justify-center">
              <div className="w-[464px]">
                <GalleryItem project={row.projects[0]} locale={locale} portrait={!isLandscape(row.projects[0])} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

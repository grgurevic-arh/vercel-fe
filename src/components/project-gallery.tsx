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

export function ProjectGallery({ locale, projects }: ProjectGalleryProps) {
  if (!projects.length) {
    return <p className="text-base text-gray-500">No project images available.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const coverAttributes = getStrapiMediaAttributes(project.coverImage);
        const coverUrl = getStrapiMediaUrl(project.coverImage);
        const coverWidth = coverAttributes?.width ?? 1200;
        const coverHeight = coverAttributes?.height ?? 900;
        const coverAlt =
          coverAttributes?.alternativeText ?? `${project.title} cover image`;
        const href = `/${locale}/work/${project.slug}`;

        return (
          <Link
            key={`${project.slug}-${project.id}`}
            href={href}
            className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={coverAlt}
                width={coverWidth}
                height={coverHeight}
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="h-60 w-full object-cover transition group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-60 items-center justify-center bg-gray-100 text-sm text-gray-500">
                No cover image
              </div>
            )}

            <div className="space-y-1 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {project.year ?? "Year TBD"}
                {project.location ? ` · ${project.location}` : ""}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {project.title}
              </p>
              {project.program ? (
                <p className="text-sm text-gray-600">{project.program}</p>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

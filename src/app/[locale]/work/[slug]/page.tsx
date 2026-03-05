import { notFound } from "next/navigation";

import { ProjectDetailContent } from "@/components/project-detail-content";
import { ProjectNavigation } from "@/components/project-navigation";
import { getWorkProjectBySlug, getWorkProjectSlugs } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import type { ProjectDetail, ProjectListing } from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function getAdjacentSlugs(
  allSlugs: Array<{ slug: string }>,
  currentSlug: string,
) {
  const index = allSlugs.findIndex((p) => p.slug === currentSlug);
  if (index === -1 || allSlugs.length < 2) {
    return { previous: null, next: null };
  }

  const prevIndex = (index - 1 + allSlugs.length) % allSlugs.length;
  const nextIndex = (index + 1) % allSlugs.length;

  return {
    previous: allSlugs[prevIndex].slug,
    next: allSlugs[nextIndex].slug,
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = await resolveLocaleParam(resolvedParams);
  const { slug } = resolvedParams;

  const [project, allSlugsRaw] = await Promise.all([
    getWorkProjectBySlug(locale, slug),
    getWorkProjectSlugs(locale),
  ]);

  if (!project) {
    notFound();
  }

  const data = requireStrapiEntity<ProjectDetail>(
    project,
    "Work project missing attributes",
  );

  const allSlugs = allSlugsRaw
    .map((entry) => unwrapStrapiEntity(entry))
    .filter((e): e is Pick<ProjectListing, "title" | "slug"> => !!e?.slug);

  const { previous, next } = getAdjacentSlugs(allSlugs, slug);

  return (
    <main>
      <ProjectDetailContent
        project={data}
        titleFallback="Untitled project"
      />

      {previous && next ? (
        <ProjectNavigation
          locale={locale}
          previousSlug={previous}
          nextSlug={next}
        />
      ) : null}
    </main>
  );
}

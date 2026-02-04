import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { ProjectDetailContent } from "@/components/project-detail-content";
import { getWorkProjectBySlug } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { ProjectDetail } from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function WorkDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = await resolveLocaleParam(resolvedParams);
  const { slug } = resolvedParams;

  const project = await getWorkProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  const projectAttributes = requireStrapiEntity<ProjectDetail>(
    project,
    "Work project missing attributes",
  );

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="Work response"
        title={`Work project detail – ${slug}`}
        description="Detailed payload for an individual work project."
        data={project}
      />
      <ProjectDetailContent
        project={projectAttributes}
        titleFallback="Untitled project"
      />
    </main>
  );
}

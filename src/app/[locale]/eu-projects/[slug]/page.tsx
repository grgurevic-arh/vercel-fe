import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { ProjectDetailContent } from "@/components/project-detail-content";
import { getEuProjectBySlug } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { ProjectDetail } from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function EuProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = await resolveLocaleParam(resolvedParams);
  const { slug } = resolvedParams;

  const project = await getEuProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  const projectAttributes = requireStrapiEntity<ProjectDetail>(
    project,
    "EU project missing attributes",
  );

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="EU project response"
        title={`EU project detail – ${slug}`}
        description="Full payload for a single EU project entry."
        data={project}
      />
      <ProjectDetailContent
        project={projectAttributes}
        titleFallback="Untitled EU project"
      />
    </main>
  );
}

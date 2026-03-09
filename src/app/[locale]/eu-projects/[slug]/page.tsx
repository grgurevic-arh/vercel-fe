import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { ProjectDetailContent } from "@/components/project-detail-content";
import { getEuProjectBySlug } from "@/lib/cms";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type { ProjectDetail } from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const validLocale = SUPPORTED_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
  const project = await getEuProjectBySlug(validLocale, slug);

  if (!project) return {};

  const data = unwrapStrapiEntity(project) as ProjectDetail | null;
  if (!data) return {};

  const firstHero = data.heroImages?.[0];
  const ogImage = firstHero?.image
    ? getStrapiMediaUrl(firstHero.image)
    : undefined;

  return {
    title: data.title,
    description: [data.discipline, data.location, data.year]
      .filter(Boolean)
      .join(" \u00b7 "),
    openGraph: ogImage ? { images: [ogImage] } : undefined,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/eu-projects/${slug}`]),
      ),
    },
  };
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
        locale={locale}
        titleFallback="Untitled EU project"
      />
    </main>
  );
}

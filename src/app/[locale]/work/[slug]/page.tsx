import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailContent } from "@/components/project-detail-content";
import { ProjectNavigation } from "@/components/project-navigation";
import { getWorkProjectBySlug, getWorkProjectSlugs } from "@/lib/cms";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type { ProjectDetail, ProjectListing } from "@/types/cms";

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
  const project = await getWorkProjectBySlug(validLocale, slug);

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
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/work/${slug}`]),
      ),
    },
  };
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
        locale={locale}
        titleFallback={t(locale).fallbacks.untitledProject}
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

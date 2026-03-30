import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectGallery } from "@/components/project-gallery";
import { WorkProjectsLoadMore } from "@/components/work-projects-load-more";
import { getWorkProjects } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam, resolvePageParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { normalizeProjectListings } from "@/lib/project-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: t(locale).pages.work,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/work`]),
      ),
    },
  };
}

const FEATURED_COUNT = 4;
const PAGE_SIZE = 10;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WorkListingPage({
  params,
  searchParams,
}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const requestedPage = await resolvePageParam(searchParams);

  // Fetch all pages from 1 to requestedPage in parallel
  const pageNumbers = Array.from({ length: requestedPage }, (_, i) => i + 1);
  const responses = await Promise.all(
    pageNumbers.map((page) => getWorkProjects(locale, page, PAGE_SIZE)),
  );

  // Use the first response's meta for pageCount validation
  const pagination = responses[0]?.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;

  if (pageCount > 0 && requestedPage > pageCount) {
    notFound();
  }

  // Combine all projects from all fetched pages
  const allProjects = normalizeProjectListings(
    responses.flatMap((r) => r.data),
  );

  const featured = allProjects
    .filter((p) => p.disableRedirect !== true)
    .slice(0, FEATURED_COUNT);

  return (
    <main>
      {/* Featured gallery */}
      <ProjectGallery locale={locale} projects={featured} />

      {/* All projects table with load more */}
      <section
        className="
          mt-[140px] md:mt-[219px] lg:mt-[140px] xl:mt-[230px]
        "
      >
        <WorkProjectsLoadMore
          locale={locale}
          initialProjects={allProjects}
          initialPage={requestedPage}
          pageCount={pageCount}
        />
      </section>

      {/* Bottom spacing (replaces old pagination spacing) */}
      <div className="mb-[140px] lg:mb-[370px]" />
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectGallery } from "@/components/project-gallery";
import { ProjectList } from "@/components/project-list";
import { Pagination } from "@/components/pagination";
import { getWorkProjects } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam, resolvePageParam } from "@/lib/request-helpers";
import { normalizeProjectListings } from "@/lib/project-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: locale === "hr" ? "Projekti" : "Work",
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/work`]),
      ),
    },
  };
}

const FEATURED_COUNT = 4;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WorkListingPage({ params, searchParams }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const requestedPage = await resolvePageParam(searchParams);

  const workProjects = await getWorkProjects(locale, requestedPage);
  const projects = normalizeProjectListings(workProjects.data);
  const pagination = workProjects.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;

  if (pageCount > 0 && requestedPage > pageCount) {
    notFound();
  }

  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <main>
      {/* Featured gallery */}
      <ProjectGallery locale={locale} projects={featured} />

      {/* All projects table */}
      <section
        className="
          mt-[100px] md:mt-[100px] lg:mt-[100px] xl:mt-[120px]
        "
      >
        <ProjectList locale={locale} projects={projects} />
      </section>

      {/* Pagination */}
      <Pagination
        locale={locale}
        basePath="/work"
        currentPage={pagination?.page ?? requestedPage}
        pageCount={pageCount}
      />
    </main>
  );
}

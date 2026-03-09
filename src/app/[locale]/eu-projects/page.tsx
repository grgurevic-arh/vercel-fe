import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectList } from "@/components/project-list";
import { Pagination } from "@/components/pagination";
import { getEuProjects } from "@/lib/cms";
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
    title: locale === "hr" ? "EU projekti" : "EU Projects",
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/eu-projects`]),
      ),
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EuProjectsPage({ params, searchParams }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const requestedPage = await resolvePageParam(searchParams);

  const response = await getEuProjects(locale, requestedPage);
  const projects = normalizeProjectListings(response.data);
  const pagination = response.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;

  if (pageCount > 0 && requestedPage > pageCount) {
    notFound();
  }

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="EU projects response"
        title="EU projects list"
        description="Paginated EU projects payload from Strapi."
        data={response}
      />

      {projects.length ? (
        <>
          <section className="space-y-4">
            <header>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Featured EU projects
              </p>
              <p className="text-sm text-gray-600">Latest published EU work.</p>
            </header>
            <ProjectGallery locale={locale} projects={projects} />
          </section>

          <section className="space-y-4">
            <header>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                All EU projects
              </p>
              <p className="text-sm text-gray-600">
                Chronological catalogue of all EU-funded projects.
              </p>
            </header>
            <ProjectList locale={locale} projects={projects} />
            <Pagination
              locale={locale}
              basePath="/eu-projects"
              currentPage={pagination?.page ?? requestedPage}
              pageCount={pageCount}
            />
          </section>
        </>
      ) : (
        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">No EU projects yet</h1>
          <p className="text-sm text-zinc-500">
            EU projects will appear here once they are published in Strapi.
          </p>
        </section>
      )}
    </main>
  );
}

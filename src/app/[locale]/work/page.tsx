import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectList } from "@/components/project-list";
import { Pagination } from "@/components/pagination";
import { getWorkProjects } from "@/lib/cms";
import { resolveLocaleParam, resolvePageParam } from "@/lib/request-helpers";
import { normalizeProjectListings } from "@/lib/project-helpers";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WorkListingPage({ params, searchParams }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const requestedPage = await resolvePageParam(searchParams);

  const workProjects = await getWorkProjects(locale, requestedPage);
  const projects = normalizeProjectListings(workProjects.data);
  const hasProjects = projects.length > 0;
  const pagination = workProjects.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;

  if (pageCount > 0 && requestedPage > pageCount) {
    notFound();
  }

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="Work response"
        title="Work projects list"
        description="Paginated list response used for the work overview page."
        data={workProjects}
      />

      {hasProjects ? (
        <>
          <section className="space-y-4">
            <header>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Featured projects
              </p>
              <p className="text-sm text-gray-600">
                Cover images for the latest published work.
              </p>
            </header>
            <ProjectGallery locale={locale} projects={projects} />
          </section>

          <section className="space-y-4">
            <header>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                All projects
              </p>
              <p className="text-sm text-gray-600">
                Browse the full work catalogue in chronological order.
              </p>
            </header>
            <ProjectList locale={locale} projects={projects} />
            <Pagination
              locale={locale}
              basePath="/work"
              currentPage={pagination?.page ?? requestedPage}
              pageCount={pageCount}
            />
          </section>
        </>
      ) : (
        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">No projects yet</h1>
          <p className="text-sm text-zinc-500">
            Work projects will appear here once they are published in Strapi.
          </p>
        </section>
      )}
    </main>
  );
}

"use client";

import { useState, useTransition } from "react";

import { ProjectList } from "@/components/project-list";
import type { NormalizedProjectListing } from "@/lib/project-helpers";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { fetchWorkProjectsPage } from "@/app/[locale]/work/actions";

interface WorkProjectsLoadMoreProps {
  locale: string;
  initialProjects: NormalizedProjectListing[];
  initialPage: number;
  pageCount: number;
}

export function WorkProjectsLoadMore({
  locale,
  initialProjects,
  initialPage,
  pageCount,
}: WorkProjectsLoadMoreProps) {
  const [projects, setProjects] =
    useState<NormalizedProjectListing[]>(initialProjects);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();

  const hasMore = currentPage < pageCount;

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    startTransition(async () => {
      try {
        const { projects: newProjects } = await fetchWorkProjectsPage(
          locale,
          nextPage,
        );
        setProjects((prev) => [...prev, ...newProjects]);
        setCurrentPage(nextPage);
        window.history.replaceState(
          null,
          "",
          `/${locale}/work?page=${nextPage}`,
        );
      } catch {
        // Allow user to retry by not updating state
      }
    });
  };

  return (
    <>
      <ProjectList locale={locale} projects={projects} />

      {hasMore ? (
        <div className="flex justify-center mt-[60px] md:mt-[80px]">
          <button
            type="button"
            disabled={isPending}
            onClick={handleLoadMore}
            aria-label={isPending ? "Loading..." : undefined}
            className="
              w-[200px]
              font-serif
              px-[20px] py-[10px]
              bg-text-primary text-white
              text-[20px] leading-[28px]
              [font-feature-settings:'onum'_1,'pnum'_1]
              hover:opacity-80
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-text-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-[8px]
            "
          >
            {isPending ? (
              <svg
                className="animate-spin h-[20px] w-[20px] text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              t(locale as Locale).pages.loadMore
            )}
          </button>
        </div>
      ) : null}
    </>
  );
}

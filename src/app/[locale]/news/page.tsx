import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { NewsList } from "@/components/news-list";
import { Pagination } from "@/components/pagination";
import { getNewsArticles } from "@/lib/cms";
import { resolveLocaleParam, resolvePageParam } from "@/lib/request-helpers";
import { normalizeNewsArticles } from "@/lib/news-helpers";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function NewsListingPage({
  params,
  searchParams,
}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const requestedPage = await resolvePageParam(searchParams);

  const response = await getNewsArticles(locale, requestedPage);
  const newsArticles = normalizeNewsArticles(response.data);
  const pagination = response.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;

  if (pageCount > 0 && requestedPage > pageCount) {
    notFound();
  }

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="News response"
        title="News articles"
        description="Latest news payload ordered by published date."
        data={response}
      />

      <section className="space-y-4">
        <header>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            All news
          </p>
          <p className="text-sm text-gray-600">
            Ordered by published date from newest to oldest.
          </p>
        </header>
        <NewsList locale={locale} articles={newsArticles} />
        <Pagination
          locale={locale}
          currentPage={pagination?.page ?? requestedPage}
          pageCount={pageCount}
        />
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsList } from "@/components/news-list";
import { Pagination } from "@/components/pagination";
import { getNewsArticles } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam, resolvePageParam } from "@/lib/request-helpers";
import { normalizeNewsArticles } from "@/lib/news-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: locale === "hr" ? "Novosti" : "News",
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/news`]),
      ),
    },
  };
}

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
    <main>
      {/* Article titles / headlines section */}
      <section
        className="
          content-wrapper
          pt-[120px] md:pt-[148px] lg:pt-[148px] xl:pt-[180px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[80px] md:pb-[120px] lg:pb-[140px] xl:pb-[180px]
        "
      >
        <ul className="space-y-[20px] md:space-y-[16px] lg:space-y-[20px] xl:space-y-[24px]">
          {newsArticles.map((article) => (
            <li key={`headline-${article.slug}-${article.id}`}>
              <Link
                href={`/${locale}/news/${article.slug}`}
                className="
                  block
                  text-[20px] leading-[28px]
                  [font-feature-settings:'onum'_1,'pnum'_1]
                  min-[320px]:text-[28px] min-[320px]:leading-[38px]
                  md:text-[38px] md:leading-[50px]
                  md:[font-feature-settings:normal]
                  text-text-primary
                  hover:underline
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                "
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* All articles table */}
      <NewsList locale={locale} articles={newsArticles} />

      {/* Pagination */}
      <Pagination
        locale={locale}
        currentPage={pagination?.page ?? requestedPage}
        pageCount={pageCount}
      />
    </main>
  );
}

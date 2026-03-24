import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsList } from "@/components/news-list";
import { Pagination } from "@/components/pagination";
import { getNewsArticles } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam, resolvePageParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { normalizeNewsArticles } from "@/lib/news-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: t(locale).pages.news,
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
          min-h-[50vh]
          pt-[236px] md:pt-[114px] lg:pt-[156px] xl:pt-[130px]
          pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[408px]
          pr-[12px] md:pr-[44px] lg:pr-[160px] xl:pr-[248px]
          pb-[140px] md:pb-[176px] lg:pb-[230px] xl:pb-[279px]
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
      <div className="mb-[140px] md:mb-[240px]">
        <Pagination
          locale={locale}
          currentPage={pagination?.page ?? requestedPage}
          pageCount={pageCount}
        />
      </div>
    </main>
  );
}

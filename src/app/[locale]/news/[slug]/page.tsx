import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { NewsList } from "@/components/news-list";
import { Pagination } from "@/components/pagination";
import { getNewsArticleBySlug, getNewsArticles } from "@/lib/cms";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import { normalizeNewsArticles } from "@/lib/news-helpers";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { NewsArticle } from "@/types/cms";

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
  const article = await getNewsArticleBySlug(validLocale, slug);

  if (!article) return {};

  const data = unwrapStrapiEntity(article) as NewsArticle | null;
  if (!data) return {};

  const ogImage = data.heroImage
    ? getStrapiMediaUrl(data.heroImage)
    : undefined;

  return {
    title: data.title,
    description: data.summary ?? undefined,
    openGraph: ogImage ? { images: [ogImage] } : undefined,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/news/${slug}`]),
      ),
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = await resolveLocaleParam(resolvedParams);
  const { slug } = resolvedParams;

  const [article, newsResponse] = await Promise.all([
    getNewsArticleBySlug(locale, slug),
    getNewsArticles(locale),
  ]);

  if (!article) {
    notFound();
  }

  const data = requireStrapiEntity<NewsArticle>(
    article,
    "News article missing attributes",
  );

  const articleTitle = data.title ?? t(locale).fallbacks.untitledArticle;
  const heroImageUrl = getStrapiMediaUrl(data.heroImage);
  const heroImageAttributes = getStrapiMediaAttributes(data.heroImage);
  const heroWidth = heroImageAttributes?.width ?? 1600;
  const heroHeight = heroImageAttributes?.height ?? 900;
  const heroAlt = heroImageAttributes?.alternativeText ?? articleTitle;
  const heroCaption = heroImageAttributes?.caption;

  const otherNews = normalizeNewsArticles(newsResponse.data).filter(
    (entry) => entry.slug !== data.slug,
  );
  const pagination = newsResponse.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;

  return (
    <main>
      {/* Title */}
      <h1
        className="
          content-wrapper
          pt-[236px] md:pt-[95px] lg:pt-[184px] xl:pt-[148px]
          pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[248px]
          pb-[20px] md:pb-[16px] lg:pb-[24px] xl:pb-[27px]
          text-[20px] leading-[28px]
          [font-feature-settings:'onum'_1,'pnum'_1]
          md:text-[28px] md:leading-[38px]
          lg:text-[38px] lg:leading-[50px]
          md:[font-feature-settings:normal]
          text-text-primary
        "
      >
        {articleTitle}
      </h1>

      {/* Body */}
      {data.body ? (
        <div
          className="
            content-wrapper
            pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[248px]
            pr-[12px] md:pr-[102px] lg:pr-[160px] xl:pr-[248px]
            pb-[25px] md:pb-[16px] lg:pb-[20px] xl:pb-[52px]
            text-[16px] leading-[23px]
            [font-feature-settings:'onum'_1,'pnum'_1]
            md:text-[20px] md:leading-[28px]
            xl:text-[28px] xl:leading-[38px]
            text-text-primary
            [&_p]:mb-[1em] [&_p:last-child]:mb-0
          "
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      ) : null}

      {/* Hero image */}
      {heroImageUrl ? (
        <figure
          className="
            content-wrapper
            pl-[0px] md:pl-[102px] lg:pl-[160px] xl:pl-[248px]
            pr-[0px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
            pb-[40px] md:pb-[48px] lg:pb-[56px]
          "
        >
          <Image
            src={heroImageUrl}
            alt={heroAlt}
            width={heroWidth}
            height={heroHeight}
            sizes="(min-width: 1024px) 944px, (min-width: 768px) 764px, (min-width: 320px) 622px, 100vw"
            className="h-auto w-full"
          />
          {heroCaption ? (
            <figcaption
              className="
                mt-[16px]
                text-[16px] leading-[23px]
                md:leading-[24px]
                [font-feature-settings:'onum'_1,'pnum'_1]
                text-text-primary
              "
            >
              {heroCaption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {/* All articles */}
      <section className="mt-[102px] md:mt-[144px] lg:mt-[166px] xl:mt-[282px]">
        <NewsList
          locale={locale}
          articles={otherNews}
          emptyMessage={t(locale).fallbacks.noAdditionalNews}
        />
      </section>

      {/* Pagination */}
      <div className="mb-[140px] md:mb-[240px]">
        <Pagination
          locale={locale}
          currentPage={pagination?.page ?? 1}
          pageCount={pageCount}
        />
      </div>
    </main>
  );
}

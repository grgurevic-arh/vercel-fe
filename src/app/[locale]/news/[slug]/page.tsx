import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { NewsList } from "@/components/news-list";
import { Pagination } from "@/components/pagination";
import { getNewsArticleBySlug, getNewsArticles } from "@/lib/cms";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
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

  const articleTitle = data.title ?? "Untitled article";
  const heroImageUrl = getStrapiMediaUrl(data.heroImage);
  const heroImageAttributes = getStrapiMediaAttributes(data.heroImage);
  const heroWidth = heroImageAttributes?.width ?? 1600;
  const heroHeight = heroImageAttributes?.height ?? 900;
  const heroAlt =
    heroImageAttributes?.alternativeText ?? articleTitle;
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
          pt-[120px] md:pt-[148px] lg:pt-[148px] xl:pt-[180px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[248px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[24px] md:pb-[32px] lg:pb-[40px]
          text-[20px] leading-[28px]
          [font-feature-settings:'onum'_1,'pnum'_1]
          min-[320px]:text-[28px] min-[320px]:leading-[38px]
          md:text-[38px] md:leading-[50px]
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
            pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[248px]
            pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
            pb-[40px] md:pb-[48px] lg:pb-[56px]
            text-[16px] leading-[23px]
            [font-feature-settings:'onum'_1,'pnum'_1]
            min-[320px]:text-[20px] min-[320px]:leading-[28px]
            md:text-[22px] md:leading-[32px]
            lg:text-[28px] lg:leading-[38px]
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
            pl-[0px] md:pl-[160px] lg:pl-[248px] xl:pl-[248px]
            pr-[0px] md:pr-[44px] lg:pr-[248px] xl:pr-[248px]
            min-[320px]:pl-[102px] min-[320px]:pr-[40px]
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
                mt-[8px] md:mt-[12px]
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
      <section className="mt-[60px] md:mt-[80px] lg:mt-[120px]">
        <NewsList
          locale={locale}
          articles={otherNews}
          emptyMessage="No additional news available."
        />
      </section>

      {/* Pagination */}
      <Pagination
        locale={locale}
        currentPage={pagination?.page ?? 1}
        pageCount={pageCount}
      />
    </main>
  );
}

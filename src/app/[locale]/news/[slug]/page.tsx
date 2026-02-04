import { notFound } from "next/navigation";

import Image from "next/image";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { NewsList } from "@/components/news-list";
import { getNewsArticleBySlug, getNewsArticles } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import {
  formatNewsDate,
  normalizeNewsArticles,
} from "@/lib/news-helpers";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { NewsArticle } from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
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

  const articleAttributes = requireStrapiEntity<NewsArticle>(
    article,
    "News article missing attributes",
  );

  const articleTitle = articleAttributes.title ?? "Untitled article";
  const publishedDate = formatNewsDate(articleAttributes.publishedAt);
  const heroImageUrl = getStrapiMediaUrl(articleAttributes.heroImage);
  const heroImageAttributes = getStrapiMediaAttributes(articleAttributes.heroImage);
  const heroWidth = heroImageAttributes?.width ?? 1600;
  const heroHeight = heroImageAttributes?.height ?? 900;
  const heroAlt =
    heroImageAttributes?.alternativeText ?? articleTitle ?? "News hero image";
  const heroCaption = heroImageAttributes?.caption;
  const otherNews = normalizeNewsArticles(newsResponse.data).filter(
    (entry) => entry.slug !== articleAttributes.slug,
  );

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="News response"
        title={`News article – ${slug}`}
        description="Full payload for a single news entry."
        data={article}
      />

      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-gray-500">Title</p>
        <h1 className="text-3xl font-semibold text-gray-900">{articleTitle}</h1>
        <p className="text-sm text-gray-600">
          Published: {publishedDate}
          {articleAttributes.author ? ` · ${articleAttributes.author}` : null}
        </p>
      </section>

      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-gray-500">Body</p>
        {articleAttributes.body ? (
          <div className="whitespace-pre-line text-base leading-relaxed text-gray-900">
            {articleAttributes.body}
          </div>
        ) : (
          <p className="text-base text-gray-500">No body content provided.</p>
        )}
      </section>

      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-gray-500">Image</p>
        {heroImageUrl ? (
          <figure className="space-y-2">
            <Image
              src={heroImageUrl}
              alt={heroAlt}
              width={heroWidth}
              height={heroHeight}
              sizes="(min-width: 768px) 60vw, 100vw"
              className="h-auto w-full max-w-3xl rounded"
            />
            {heroCaption ? (
              <figcaption className="text-sm text-gray-600">
                {heroCaption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <p className="text-base text-gray-500">No hero image provided.</p>
        )}
      </section>

      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Other news
        </p>
        <NewsList
          locale={locale}
          articles={otherNews}
          emptyMessage="No additional news available."
        />
      </section>
    </main>
  );
}

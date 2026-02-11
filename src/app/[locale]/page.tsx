import { notFound } from "next/navigation";

import { getHomepage, getNewsArticles, getLegalPage } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import { normalizeNewsArticles } from "@/lib/news-helpers";
import { HomepageCarousel } from "@/components/homepage-carousel";
import { HomepageFeed } from "@/components/homepage-feed";
import { ContactInfo } from "@/components/contact-info";
import type {
  Homepage,
  LegalPage,
  StrapiMedia,
} from "@/types/cms";
import type { CarouselSlide } from "@/components/homepage-carousel";
import type { FeedItem } from "@/components/homepage-feed";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function buildCarouselSlides(
  hero: Homepage["hero"],
  fallbackAlt: string,
): CarouselSlide[] {
  if (!hero?.length) return [];

  return hero.reduce<CarouselSlide[]>((acc, entry) => {
    const media = entry?.image ?? (entry as unknown as StrapiMedia);
    const url = getStrapiMediaUrl(media);
    if (!url) return acc;

    const attrs = getStrapiMediaAttributes(media);
    acc.push({
      url,
      alt: entry?.alternativeText ?? attrs?.alternativeText ?? fallbackAlt,
      width: attrs?.width ?? 1600,
      height: attrs?.height ?? 900,
    });
    return acc;
  }, []);
}

function buildFeedItems(
  newsData: Awaited<ReturnType<typeof getNewsArticles>>,
): FeedItem[] {
  const articles = normalizeNewsArticles(newsData.data);
  return articles.map((a) => ({
    title: a.title,
    summary: a.summary,
    slug: a.slug,
  }));
}

export default async function LocaleHomepage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);

  // Fetch all data in parallel
  const [homepageData, newsData, legalData] = await Promise.all([
    getHomepage(locale),
    getNewsArticles(locale, 1, 3),
    getLegalPage(locale),
  ]);

  if (!homepageData) {
    notFound();
  }

  const homepage = requireStrapiEntity<Homepage>(
    homepageData,
    "Homepage entry missing",
  );

  const legal = legalData ? unwrapStrapiEntity(legalData) as LegalPage | null : null;

  const slides = buildCarouselSlides(homepage.hero, homepage.heading ?? "Hero");
  const feedItems = buildFeedItems(newsData);

  return (
    <main>
      {/* Description */}
      <section
        className="
          pt-[156px] md:pt-[184px] lg:pt-[178px] xl:pt-[232px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[24px] md:pb-[38px] lg:pb-[54px] xl:pb-[47px]
        "
      >
        {homepage.content ? (
          <p
            className="
              text-[16px] leading-[23px]
              md:text-[20px] md:leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              xl:text-[28px] xl:leading-[38px]
              text-[var(--text-primary)]
              max-w-[296px] md:max-w-[506px] lg:max-w-[644px] xl:max-w-[784px]
            "
          >
            {homepage.content}
          </p>
        ) : null}
      </section>

      {/* Hero Carousel */}
      <HomepageCarousel slides={slides} />

      {/* Feed */}
      <div className="mt-[36px] md:mt-[56px] lg:mt-[50px] xl:mt-[80px]">
        <HomepageFeed locale={locale} items={feedItems} />
      </div>

      {/* Contact Info */}
      <div className="mt-[60px] md:mt-[60px] lg:mt-[60px] xl:mt-[60px]">
        <ContactInfo
          email={legal?.email ?? null}
          telephone={legal?.telephone ?? null}
        />
      </div>
    </main>
  );
}

import { notFound } from "next/navigation";

import { getHomepage, getFooter } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import { HomepageCarousel } from "@/components/homepage-carousel";
import { BlocksRenderer } from "@/components/blocks-renderer";
import { ContactInfo } from "@/components/contact-info";
import type { Homepage, Footer, StrapiMedia } from "@/types/cms";
import type { CarouselSlide } from "@/components/homepage-carousel";

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

export default async function LocaleHomepage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);

  // Fetch all data in parallel
  const [homepageData, footerData] = await Promise.all([
    getHomepage(locale),
    getFooter(locale),
  ]);

  if (!homepageData) {
    notFound();
  }

  const homepage = requireStrapiEntity<Homepage>(
    homepageData,
    "Homepage entry missing",
  );

  const footer = footerData ? unwrapStrapiEntity(footerData) as Footer | null : null;

  const slides = buildCarouselSlides(homepage.hero, homepage.heading ?? "Hero");

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
        {homepage.heading ? (
          <h1
            className="text-[16px] leading-[23px]
              md:text-[20px] md:leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              xl:text-[28px] xl:leading-[38px]
              text-text-primary whitespace-pre-line"
          >
            {homepage.heading}
          </h1>
        ) : null}
      </section>

      {/* Hero Carousel */}
      <HomepageCarousel slides={slides} />

      {/* Content */}
      <section
        className="
          pt-[156px] md:pt-[184px] lg:pt-[178px] xl:pt-[232px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[24px] md:pb-[38px] lg:pb-[54px] xl:pb-[47px]
        "
      >
        {homepage.content?.length ? (
          <BlocksRenderer
            content={homepage.content}
            className="
              text-[16px] leading-[23px]
              md:text-[20px] md:leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              xl:text-[28px] xl:leading-[38px]
              text-text-primary whitespace-pre-line
              max-w-[296px] md:max-w-[506px] lg:max-w-[644px] xl:max-w-[784px]
            "
          />
        ) : null}
      </section>

      {/* Contact Info */}
      <div className="mt-[60px]">
        <ContactInfo
          email={footer?.email ?? null}
          telephone={footer?.phoneNumber ?? null}
          companyName={footer?.companyName ?? undefined}
          address={footer?.address ?? undefined}
        />
      </div>
    </main>
  );
}

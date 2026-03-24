import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHomepage, getFooter } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import { HomepageCarousel } from "@/components/homepage-carousel";
import { BlocksRenderer } from "@/components/blocks-renderer";
import { ContactInfo } from "@/components/contact-info";
import { JsonLd } from "@/components/json-ld";
import type { Homepage, Footer, StrapiMedia } from "@/types/cms";
import type { CarouselSlide } from "@/components/homepage-carousel";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);
  const homepage = await getHomepage(locale);
  const data = homepage
    ? (unwrapStrapiEntity(homepage) as Homepage | null)
    : null;

  const description =
    data?.heading ?? "Architecture and urban planning studio based in Zagreb.";

  return {
    description,
    alternates: {
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `/${l}`])),
    },
  };
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

  const footer = footerData
    ? (unwrapStrapiEntity(footerData) as Footer | null)
    : null;

  const slides = buildCarouselSlides(homepage.hero, homepage.heading ?? "Hero");

  return (
    <main>
      {/* Description */}
      <section
        className="
          content-wrapper
          pt-[156px] md:pt-[184px] lg:pt-[178px] xl:pt-[232px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[63px] md:pb-[148px] lg:pb-[204px] xl:pb-[169px]
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
          content-wrapper
          pt-[41px] md:pt-[111px] lg:pt-[98px] xl:pt-[167px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
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
              md:max-w-[506px] lg:max-w-[644px] xl:max-w-[784px]
              [&_h3]:mb-[10px] [&_h3]:md:mb-[12px] [&_h3]:lg:mb-[16px] [&_h3]:xl:mb-[12px]
              [&_h3]:mt-[47px] [&_h3]:md:mt-[40px] [&_h3]:lg:mt-[70px] [&_h3]:xl:mt-[54px]
              [&_h3:first-child]:mt-0
            "
          />
        ) : null}
      </section>

      {/* Contact Info */}
      <ContactInfo
        email={footer?.email ?? null}
        telephone={footer?.phoneNumber ?? null}
        companyName={footer?.companyName ?? undefined}
        address={footer?.address ?? undefined}
        showTopBorder
        className="mt-[123px] md:mt-[206px] lg:mt-[150px] xl:mt-[134px] mb-[222px] md:mb-0 lg:mb-[278px] xl:mb-[372px]"
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Grgurević & partneri",
          description:
            "Architecture and urban planning studio based in Zagreb.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Zagreb",
            addressCountry: "HR",
          },
        }}
      />
    </main>
  );
}

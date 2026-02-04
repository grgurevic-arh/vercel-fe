import Image from "next/image";
import { notFound } from "next/navigation";

import { getHomepage } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import { RawDataAccordion } from "@/components/raw-data-accordion";
import type {
  Homepage,
  ImageWithCaption,
  StrapiMedia,
  StrapiMediaAttributes,
} from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const isImageWithCaption = (value: unknown): value is ImageWithCaption => {
  return (
    typeof value === "object" &&
    value !== null &&
    "image" in (value as Record<string, unknown>)
  );
};

const isStrapiMedia = (value: unknown): value is StrapiMedia => {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in (value as Record<string, unknown>)
  );
};

const isStrapiMediaAttributes = (
  value: unknown,
): value is StrapiMediaAttributes => {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in (value as Record<string, unknown>)
  );
};

export default async function LocaleHomepage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const homepage = await getHomepage(locale);

  if (!homepage) {
    notFound();
  }

  const homepageAttributes =
    homepage.attributes ?? (homepage as unknown as Homepage | null);

  if (!homepageAttributes) {
    notFound();
  }

  const { heading, content, hero } = homepageAttributes;
  const heroRaw = hero as unknown;
  const heroEntries = Array.isArray(heroRaw)
    ? heroRaw
    : heroRaw
      ? [heroRaw]
      : [];
  const heroEntry =
    heroEntries.find((entry) => isImageWithCaption(entry)) ?? heroEntries[0];
  const heroEntryHasImage = isImageWithCaption(heroEntry);
  const heroEntryIsMedia = isStrapiMedia(heroEntry);
  const heroEntryIsMediaAttributes = isStrapiMediaAttributes(heroEntry);
  const heroMedia: StrapiMedia | StrapiMediaAttributes | null = heroEntryHasImage
    ? heroEntry.image
    : heroEntryIsMedia || heroEntryIsMediaAttributes
      ? (heroEntry as StrapiMedia | StrapiMediaAttributes)
      : null;
  const heroImageUrl = getStrapiMediaUrl(heroMedia);
  const heroMediaAttributes = getStrapiMediaAttributes(heroMedia);
  const heroWidth = heroMediaAttributes?.width ?? 1600;
  const heroHeight = heroMediaAttributes?.height ?? 900;
  const heroAlt =
    (heroEntryHasImage ? heroEntry.alternativeText : null) ??
    heroMediaAttributes?.alternativeText ??
    heading ??
    "Hero image";
  const heroDescription = heroEntryHasImage ? heroEntry.description : null;

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="Homepage response"
        title="Homepage payload"
        description="Current Strapi response for the homepage single type."
        data={homepage}
      />

      <section>
        <p className="text-sm uppercase tracking-wide text-gray-500">Heading</p>
        <h1 className="mt-2 text-3xl font-semibold">
          {heading ?? "Untitled homepage"}
        </h1>
      </section>

      {heroImageUrl ? (
        <section>
          <p className="text-sm uppercase tracking-wide text-gray-500">Hero</p>
          <div className="mt-2">
            <Image
              src={heroImageUrl}
              alt={heroAlt}
              width={heroWidth}
              height={heroHeight}
              sizes="(min-width: 768px) 60vw, 100vw"
              className="h-auto w-full max-w-3xl rounded"
              priority
            />
            {heroDescription ? (
              <p className="mt-2 text-base text-gray-600">{heroDescription}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {content ? (
        <section>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Description
          </p>
          <p className="mt-2 text-lg leading-relaxed">{content}</p>
        </section>
      ) : null}
    </main>
  );
}

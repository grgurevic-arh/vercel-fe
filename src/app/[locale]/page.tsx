import { notFound } from "next/navigation";

import { getHomepage } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import { RawDataAccordion } from "@/components/raw-data-accordion";
import { HeroCarousel } from "@/components/hero-carousel";
import type {
  Homepage,
  ImageWithCaption,
  StrapiMedia,
  StrapiMediaAttributes,
} from "@/types/cms";
import type { HeroCarouselItem } from "@/components/hero-carousel";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const coerceArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
};

const isImageWithCaption = (value: unknown): value is ImageWithCaption => {
  return (
    typeof value === "object" &&
    value !== null &&
    "image" in (value as Record<string, unknown>)
  );
};

export default async function LocaleHomepage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const homepage = await getHomepage(locale);

  if (!homepage) {
    notFound();
  }

  const homepageAttributes = requireStrapiEntity<Homepage>(
    homepage,
    "Homepage entry missing attributes",
  );

  const { heading, content, hero } = homepageAttributes;
  const heroEntries = coerceArray(hero as unknown);
  const normalizedHeroEntries = heroEntries.reduce<HeroCarouselItem[]>(
    (acc, entry) => {
      const entryWithCaption = isImageWithCaption(entry)
        ? entry
        : null;
      const media = entryWithCaption
        ? entryWithCaption.image
        : (entry as StrapiMedia | StrapiMediaAttributes | null | undefined);
      const mediaAttributes = getStrapiMediaAttributes(media);
      const url = getStrapiMediaUrl(media);
      if (!url) {
        return acc;
      }

      acc.push({
        url,
        width: mediaAttributes?.width ?? 1600,
        height: mediaAttributes?.height ?? 900,
        alt:
          entryWithCaption?.alternativeText ??
          mediaAttributes?.alternativeText ??
          heading ??
          "Hero image",
        description: entryWithCaption?.description ?? null,
      });

      return acc;
    },
    [],
  );

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

      {normalizedHeroEntries.length ? (
        <section>
          <p className="text-sm uppercase tracking-wide text-gray-500">Hero</p>
          <div className="mt-4">
            <HeroCarousel items={normalizedHeroEntries} />
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

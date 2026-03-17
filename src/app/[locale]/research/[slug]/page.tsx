import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PollForm } from "@/components/poll-form";
import { getEntryPollBySlug } from "@/lib/cms";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { unwrapStrapiEntity, requireStrapiEntity } from "@/lib/strapi-entity";
import type { EntryPoll } from "@/types/cms";

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
  const raw = await getEntryPollBySlug(validLocale, slug);

  if (!raw) return {};

  const poll = unwrapStrapiEntity(raw) as EntryPoll | null;
  if (!poll) return {};

  return {
    title: poll.projectName,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/research/${slug}`]),
      ),
    },
  };
}

export default async function PollDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = await resolveLocaleParam(resolvedParams);
  const { slug } = resolvedParams;

  const raw = await getEntryPollBySlug(locale, slug);

  if (!raw) {
    notFound();
  }

  const poll = requireStrapiEntity<EntryPoll>(
    raw,
    "Entry poll missing attributes",
  );

  return (
    <main>
      {/* Title — uses content padding */}
      <h1
        className="
          content-wrapper
          px-[12px] md:px-[44px] lg:px-[160px] xl:px-[328px]
          font-sans text-text-primary
          pt-[86px] md:pt-[184px] lg:pt-[216px] xl:pt-[190px]
          text-[28px] leading-[38px]
          md:text-[38px] md:leading-[50px] md:text-center
          lg:text-[66px] lg:leading-normal lg:text-center
          xl:text-left
          mb-[34px] md:mb-[26px] lg:mb-[66px] xl:mb-[94px]
        "
      >
        {t(locale).pages.yourOpinion}
      </h1>

      {/* Divider — full width */}
      <hr className="border-divider" />

      {/* Content — uses content padding */}
      <section
        className="
          content-wrapper
          px-[12px] md:px-[44px] lg:px-[160px] xl:px-[328px]
          pb-[80px] md:pb-[120px] lg:pb-[140px] xl:pb-[180px]
          mt-[32px] md:mt-[52px] lg:mt-[80px] xl:mt-[52px]
        "
      >
        <h2
          className="
            font-sans text-text-primary
            text-[20px] leading-[28px]
            md:text-[22px] md:leading-[32px]
            lg:text-[28px] lg:leading-[38px]
            [font-feature-settings:'onum'_1,'pnum'_1]
            lg:[font-feature-settings:normal]
            mb-[58px] md:mb-[60px]
          "
        >
          {poll.projectName}
        </h2>

        <PollForm poll={poll} locale={locale} />
      </section>
    </main>
  );
}

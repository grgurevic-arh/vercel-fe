import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PollForm } from "@/components/poll-form";
import { getEntryPollBySlug } from "@/lib/cms";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
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
      <section
        className="
          pt-[120px] md:pt-[148px] lg:pt-[148px] xl:pt-[180px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[80px] md:pb-[120px] lg:pb-[140px] xl:pb-[180px]
        "
      >
        <h1
          className="
            pb-[24px] md:pb-[32px] lg:pb-[40px]
            text-[20px] leading-[28px]
            [font-feature-settings:'onum'_1,'pnum'_1]
            min-[320px]:text-[28px] min-[320px]:leading-[38px]
            md:text-[38px] md:leading-[50px]
            md:[font-feature-settings:normal]
            text-text-primary
          "
        >
          {poll.projectName}
        </h1>

        <PollForm poll={poll} locale={locale} />
      </section>
    </main>
  );
}

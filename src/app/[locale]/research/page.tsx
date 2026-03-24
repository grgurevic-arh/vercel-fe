import type { Metadata } from "next";
import Link from "next/link";

import { getEntryPolls } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { unwrapStrapiEntity } from "@/lib/strapi-entity";
import type { EntryPoll } from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: t(locale).pages.research,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/research`]),
      ),
    },
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResearchPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const response = await getEntryPolls(locale);

  const polls = response.data
    .map((item) => unwrapStrapiEntity(item))
    .filter((poll): poll is EntryPoll => poll !== null);

  const emptyMessage = t(locale).pages.noActivePolls;

  return (
    <main className="min-h-[calc(100vh-414px)] md:min-h-[calc(100vh-294px)] xl:min-h-[calc(100vh-380px)]">
      <section
        className="
          content-wrapper
          pt-[120px] md:pt-[148px] lg:pt-[148px] xl:pt-[180px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[80px] md:pb-[120px] lg:pb-[140px] xl:pb-[180px]
        "
      >
        {polls.length === 0 ? (
          <p
            className="
              text-[20px] leading-[28px]
              min-[320px]:text-[28px] min-[320px]:leading-[38px]
              md:text-[38px] md:leading-[50px]
              text-text-primary
            "
          >
            {emptyMessage}
          </p>
        ) : (
          <ul className="space-y-[20px] md:space-y-[16px] lg:space-y-[20px] xl:space-y-[24px]">
            {polls.map((poll) => (
              <li key={poll.slug}>
                <Link
                  href={`/${locale}/research/${poll.slug}`}
                  className="
                    block
                    text-[20px] leading-[28px]
                    [font-feature-settings:'onum'_1,'pnum'_1]
                    min-[320px]:text-[28px] min-[320px]:leading-[38px]
                    md:text-[38px] md:leading-[50px]
                    md:[font-feature-settings:normal]
                    text-text-primary
                    hover:underline
                    focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black
                  "
                >
                  {poll.projectName}
                </Link>
                {poll.description ? (
                  <p
                    className="
                      mt-[4px] md:mt-[8px]
                      text-[16px] leading-[23px]
                      md:text-[20px] md:leading-[28px]
                      text-text-primary/70"
                  >
                    {stripHtml(poll.description)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

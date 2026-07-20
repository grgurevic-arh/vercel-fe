import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImpressumDetails } from "@/components/impressum-details";
import { getLegalPage } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { LegalPage } from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: t(locale).pages.legal,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/legal`]),
      ),
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LegalPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const legal = await getLegalPage(locale);

  if (!legal) {
    notFound();
  }

  const data = requireStrapiEntity<LegalPage>(
    legal,
    "Legal entry missing attributes",
  );

  return (
    <main>
      {/* Heading */}
      <section
        className="
          content-wrapper
          pt-[86px] md:pt-[184px] lg:pt-[216px] xl:pt-[190px]
          pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[328px]
          pb-[54px] md:pb-[76px] lg:pb-[85px] xl:pb-[113px]
        "
      >
        <h1
          className="
            text-[36px] md:text-[48px] lg:text-[56px] xl:text-[66px]
            leading-[100%] text-text-primary
          "
        >
          {t(locale).pages.legal}
        </h1>
      </section>

      {/* Impressum details */}
      <ImpressumDetails locale={locale} data={data} />
    </main>
  );
}

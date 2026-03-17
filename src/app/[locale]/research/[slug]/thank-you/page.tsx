import type { Metadata } from "next";

import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: t(locale).pages.thankYou,
  };
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ThankYouPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);

  return (
    <main>
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

      <hr className="border-divider" />

      <section
        className="
          content-wrapper
          px-[12px] md:px-[44px] lg:px-[160px] xl:px-[328px]
          pb-[80px] md:pb-[120px] lg:pb-[140px] xl:pb-[180px]
          mt-[32px] md:mt-[52px] lg:mt-[80px] xl:mt-[52px]
        "
      >
        <p
          className="
            font-sans text-text-primary
            text-[20px] leading-[28px]
            md:text-[22px] md:leading-[32px]
            lg:text-[28px] lg:leading-[38px]
            [font-feature-settings:'onum'_1,'pnum'_1]
            lg:[font-feature-settings:normal]
          "
        >
          {locale === "hr"
            ? "Hvala na sudjelovanju u anketi!"
            : "Thank you for participating in the survey!"}
        </p>
      </section>
    </main>
  );
}

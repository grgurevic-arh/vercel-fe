import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlocksRenderer } from "@/components/blocks-renderer";
import { getPrivacyPolicy } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { PrivacyPolicy } from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: t(locale).pages.privacyPolicy,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/privacy-policy`]),
      ),
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const policyData = await getPrivacyPolicy(locale);

  if (!policyData) {
    notFound();
  }

  const data = requireStrapiEntity<PrivacyPolicy>(
    policyData,
    "Privacy policy entry missing attributes",
  );

  return (
    <main>
      {/* Heading */}
      <section
        className="
          content-wrapper
          pt-[120px] md:pt-[144px] lg:pt-[154px] xl:pt-[270px]
          pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[328px]
          pb-[24px] md:pb-[32px] lg:pb-[40px] xl:pb-[100px]
        "
      >
        <h1
          className="
            text-[36px] md:text-[48px] lg:text-[56px] xl:text-[66px]
            leading-[100%] text-text-primary
          "
        >
          {t(locale).pages.privacyPolicy}
        </h1>
      </section>

      {/* Content */}
      <section
        className="
          content-wrapper
          pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[328px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[408px]
          pb-[80px] md:pb-[100px] lg:pb-[120px] xl:pb-[160px]
        "
      >
        {data.content?.length ? (
          <BlocksRenderer
            content={data.content}
            className="
              text-text-primary whitespace-pre-line
              [&_p]:text-[16px] [&_p]:leading-[23px]
              [&_p]:xl:text-[20px] [&_p]:xl:leading-[28px]
              [&_p]:mb-0
              [&_ul]:text-[16px] [&_ul]:leading-[23px]
              [&_ol]:text-[16px] [&_ol]:leading-[23px]
              [&_h2]:italic [&_h2]:text-[20px] [&_h2]:leading-normal [&_h2]:mb-[8px]
              [&_h3]:italic [&_h3]:text-[20px] [&_h3]:leading-normal [&_h3]:mb-[8px]
              [&_h4]:italic [&_h4]:text-[20px] [&_h4]:leading-normal [&_h4]:mb-[8px]
            "
          />
        ) : null}
      </section>
    </main>
  );
}

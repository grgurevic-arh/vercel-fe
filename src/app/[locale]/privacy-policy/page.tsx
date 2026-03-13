import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlocksRenderer } from "@/components/blocks-renderer";
import { getPrivacyPolicy } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { PrivacyPolicy } from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: locale === "hr" ? "Politika privatnosti" : "Privacy Policy",
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
          Privacy Policy
        </h1>
      </section>

      {/* Content */}
      <section
        className="
          content-wrapper
          pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[328px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[24px] md:pb-[38px] lg:pb-[54px] xl:pb-[47px]
        "
      >
        {data.content?.length ? (
          <BlocksRenderer
            content={data.content}
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
    </main>
  );
}

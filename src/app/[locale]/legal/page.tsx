import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyMetadata } from "@/components/company-metadata";
import { ContactInfo } from "@/components/contact-info";
import { getFooter, getLegalPage } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import type { Footer, LegalPage } from "@/types/cms";

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
  const [legal, footerData] = await Promise.all([
    getLegalPage(locale),
    getFooter(locale),
  ]);

  if (!legal) {
    notFound();
  }

  const data = requireStrapiEntity<LegalPage>(
    legal,
    "Legal entry missing attributes",
  );

  const footer = footerData
    ? (unwrapStrapiEntity(footerData) as Footer | null)
    : null;

  return (
    <main>
      {/* Heading */}
      <section
        className="
          content-wrapper
          pt-[120px] md:pt-[144px] lg:pt-[154px] xl:pt-[270px]
          pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[328px]
          pb-[24px] md:pb-[32px] lg:pb-[40px] xl:pb-[100px]
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

      {/* Company Metadata */}
      <CompanyMetadata
        bank={data.bank}
        swift={data.swift}
        iban={data.iban}
        oib={data.oib}
        mb={data.mb}
        mbs={data.mbs}
        vatId={data.vatId}
        shareCapital={data.shareCapital}
        board={data.board}
        foto={data.foto}
        website={data.website}
      />

      {/* Contact Info */}
      <ContactInfo
        email={footer?.email ?? null}
        telephone={footer?.phoneNumber ?? null}
        companyName={footer?.companyName ?? undefined}
        address={footer?.address ?? undefined}
        showTopBorder
      />
    </main>
  );
}

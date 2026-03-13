import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyMetadata } from "@/components/company-metadata";
import { ContactInfo } from "@/components/contact-info";
import { getFooter, getLegalPage } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
import type { Footer, LegalPage } from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: locale === "hr" ? "Pravne informacije" : "Legal",
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
          Legal
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
      <div className="mt-[60px] md:mt-[80px] lg:mt-[120px] xl:mt-[200px]">
        <ContactInfo
          email={footer?.email ?? null}
          telephone={footer?.phoneNumber ?? null}
          companyName={footer?.companyName ?? undefined}
          address={footer?.address ?? undefined}
        />
      </div>
    </main>
  );
}

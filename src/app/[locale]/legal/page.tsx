import { notFound } from "next/navigation";

import { CompanyMetadata } from "@/components/company-metadata";
import { ContactInfo } from "@/components/contact-info";
import { getLegalPage } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { LegalPage } from "@/types/cms";

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
        bk={data.bk}
        swift={data.swift}
        iban={data.iban}
        oib={data.oib}
        mb={data.mb}
        mbs={data.mbs}
        capital={data.capital}
        board={data.board}
        foto={data.foto}
        activity={data.activity}
      />

      {/* Contact Info */}
      <div className="mt-[60px] md:mt-[80px] lg:mt-[120px] xl:mt-[200px]">
        <ContactInfo
          email={data.email ?? null}
          telephone={data.telephone ?? null}
          companyName={"Grgurevi\u0107 & Partners LTD."}
          address={"\u010Cani\u0107eva 6, Zagreb, HR-10000"}
        />
      </div>
    </main>
  );
}

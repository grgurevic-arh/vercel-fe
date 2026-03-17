import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BorderedSection } from "@/components/bordered-section";
import { ContactInfo } from "@/components/contact-info";
import { getFooter, getOfficePage } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import {
  requireStrapiEntity,
  unwrapStrapiEntity,
} from "@/lib/strapi-entity";
import type {
  ClientPartnerCard,
  Footer,
  OfficePage,
  TeamMember,
} from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: t(locale).pages.office,
    description:
      locale === "hr"
        ? "Upoznajte naš tim arhitekata i partnera."
        : "Meet our team of architects and partners.",
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/office`]),
      ),
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function OfficePage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);

  const [officeData, footerData] = await Promise.all([
    getOfficePage(locale),
    getFooter(locale),
  ]);

  if (!officeData) {
    notFound();
  }

  const data = requireStrapiEntity<OfficePage>(
    officeData,
    "Office entry missing attributes",
  );

  const footer = footerData
    ? (unwrapStrapiEntity(footerData) as Footer | null)
    : null;

  const teamMembers = (data.team ?? []) as TeamMember[];
  const clients = (data.clients ?? []) as ClientPartnerCard[];

  const labelClass =
    "shrink-0 tracking-[0.03em] [font-variant-caps:small-caps] text-[16px] leading-[23px] text-text-primary lg:w-[130px] xl:w-[150px]";
  const itemInnerClass =
    "flex flex-col lg:flex-row py-[12px] md:py-[16px] xl:py-[20px] pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px] pr-[12px] md:pr-[20px]";
  const textClass = "text-[16px] leading-[23px] text-text-primary";

  return (
    <main>
      {/* Description */}
      <section
        className="
          content-wrapper
          pt-[156px] md:pt-[184px] lg:pt-[178px] xl:pt-[232px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[24px] md:pb-[38px] lg:pb-[54px] xl:pb-[47px]
        "
      >
        {data.description ? (
          <p
            className="
              text-[16px] leading-[23px]
              md:text-[20px] md:leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              text-text-primary whitespace-pre-line
            "
          >
            {data.description}
          </p>
        ) : null}
      </section>

      {/* Team */}
      {teamMembers.length > 0 && (
        <section>
          <h2
            className="
              content-wrapper
              pt-[80px] md:pt-[120px] lg:pt-[140px] xl:pt-[180px]
              pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
              pb-[24px] md:pb-[32px] xl:pb-[40px]
              text-[20px] leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              text-text-primary
            "
          >
            Team
          </h2>
          <div className="border-t border-divider">
            {(() => {
              const rows: TeamMember[][] = [];
              for (let i = 0; i < teamMembers.length; i += 2) {
                rows.push(teamMembers.slice(i, i + 2));
              }
              return rows.map((row, rowIndex) => (
                <BorderedSection
                  key={rowIndex}
                  border="border-b border-divider"
                  className={`grid grid-cols-1 min-[321px]:grid-cols-2`}
                >
                  {row.map((member, i) => (
                    <div
                      key={`${member.name}-${member.role}-${i}`}
                      className={`${itemInnerClass} ${i === 0 && row.length > 1 ? "border-b border-divider min-[321px]:border-b-0" : ""}`}
                    >
                      <span className={labelClass}>{member.role}</span>
                      <div>
                        <p className={textClass}>{member.name}</p>
                        {member.title ? (
                          <p className={textClass}>{member.title}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </BorderedSection>
              ));
            })()}
          </div>
        </section>
      )}

      {/* Clients & partner institutions */}
      {clients.length > 0 && (
        <section>
          <h2
            className="
              content-wrapper
              pt-[80px] md:pt-[120px] lg:pt-[140px] xl:pt-[180px]
              pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
              pb-[24px] md:pb-[32px] xl:pb-[40px]
              text-[20px] leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              text-text-primary
            "
          >
            Clients & partner institutions
          </h2>
          <div className="border-t border-divider">
            {(() => {
              const rows: ClientPartnerCard[][] = [];
              for (let i = 0; i < clients.length; i += 2) {
                rows.push(clients.slice(i, i + 2));
              }
              return rows.map((row, rowIndex) => (
                <BorderedSection
                  key={rowIndex}
                  border="border-b border-divider"
                  className={`grid grid-cols-1 min-[321px]:grid-cols-2`}
                >
                  {row.map((client, i) => (
                    <div
                      key={`${client.title}-${client.role}-${i}`}
                      className={`${itemInnerClass} ${i === 0 && row.length > 1 ? "border-b border-divider min-[321px]:border-b-0" : ""}`}
                    >
                      <span className={labelClass}>{client.role}</span>
                      <div>
                        <p className={textClass}>{client.title}</p>
                        {client.subtitle ? (
                          <p className={textClass}>{client.subtitle}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </BorderedSection>
              ));
            })()}
          </div>
        </section>
      )}

      {/* Contact Info */}
      <ContactInfo
        email={footer?.email ?? null}
        telephone={footer?.phoneNumber ?? null}
        companyName={footer?.companyName ?? undefined}
        address={footer?.address ?? undefined}
        className="mt-[140px] md:mt-[240px] lg:mt-[240px] xl:mt-[240px]"
      />
    </main>
  );
}

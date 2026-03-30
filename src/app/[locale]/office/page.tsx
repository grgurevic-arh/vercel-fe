import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BorderedSection } from "@/components/bordered-section";
import { ContactInfo } from "@/components/contact-info";
import { getFooter, getOfficePage } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { requireStrapiEntity, unwrapStrapiEntity } from "@/lib/strapi-entity";
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
    description: t(locale).pages.officeDescription,
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
    "shrink-0 tracking-[0.03em] lowercase [font-variant-caps:small-caps] text-[16px] leading-[23px] text-text-primary lg:w-[180px] xl:w-[240px]";
  const itemInnerClass =
    "flex flex-col lg:flex-row py-[12px] md:py-[16px] xl:py-[20px] pl-[12px] md:pl-[102px] lg:pl-[40px] xl:pl-[88px] pr-[12px] md:pr-[20px]";
  const textClass = "text-[16px] leading-[23px] text-text-primary";

  return (
    <main>
      {/* Description */}
      <section
        className="
          content-wrapper
          pt-[236px] md:pt-[184px] lg:pt-[184px] xl:pt-[190px]
          pl-[12px] md:pl-[102px] lg:pl-[220px] xl:pl-[328px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[93px] md:pb-[124px] lg:pb-[154px] xl:pb-[216px]
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
              pl-[12px] md:pl-[102px] lg:pl-[220px] xl:pl-[328px]
              pb-[24px] md:pb-[32px] xl:pb-[40px]
              text-[20px] leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              text-text-primary
            "
          >
            {t(locale).pages.team}
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
                  className={`grid grid-cols-1 md:grid-cols-2`}
                >
                  {row.map((member, i) => (
                    <div
                      key={`${member.name}-${member.role}-${i}`}
                      className={`${itemInnerClass} ${i === 0 && row.length > 1 ? "border-b border-divider md:border-b-0" : ""}`}
                    >
                      <span className={labelClass}>{member.role}</span>
                      <div>
                        <p className={textClass}>{member.name}</p>
                        {member.title ? (
                          <p className="text-[12px] xl:text-[16px] leading-[20px] xl:leading-[23px] text-[#636363]">
                            {member.title
                              .split(/(\b[A-Z]{2,}\b)/)
                              .map((part: string, idx: number) =>
                                /^[A-Z]{2,}$/.test(part) ? (
                                  <span
                                    key={idx}
                                    className="lowercase [font-variant-caps:small-caps] tracking-[0.48px]"
                                  >
                                    {part}
                                  </span>
                                ) : (
                                  part
                                ),
                              )}
                          </p>
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
              pl-[12px] md:pl-[102px] lg:pl-[220px] xl:pl-[328px]
              pb-[24px] md:pb-[32px] xl:pb-[40px]
              text-[20px] leading-[28px]
              lg:text-[28px] lg:leading-[38px]
              text-text-primary
            "
          >
            {t(locale).pages.clientsAndPartners}
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
                  className={`grid grid-cols-1 md:grid-cols-2`}
                >
                  {row.map((client, i) => (
                    <div
                      key={`${client.title}-${client.role}-${i}`}
                      className={`${itemInnerClass} ${i === 0 && row.length > 1 ? "border-b border-divider md:border-b-0" : ""}`}
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
        className="mt-[140px] md:mt-[140px] lg:mt-[240px] xl:mt-[240px] md:mb-[70px] lg:mb-[330px] xl:mb-[250px]"
      />
    </main>
  );
}

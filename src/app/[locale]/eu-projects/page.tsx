import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BlocksRenderer } from "@/components/blocks-renderer";
import { BorderedSection } from "@/components/bordered-section";
import { getEuProjectPage } from "@/lib/cms";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { EuProjectPage } from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: locale === "hr" ? "EU projekti" : "EU Projects",
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/eu-projects`]),
      ),
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EuProjectsPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const euProjectData = await getEuProjectPage(locale);

  if (!euProjectData) {
    notFound();
  }

  const data = requireStrapiEntity<EuProjectPage>(
    euProjectData,
    "EU project page missing attributes",
  );

  const metadataRows = [
    data.projectWorth && {
      label: locale === "hr" ? "Ukupna vrijednost projekta" : "Project Worth",
      value: data.projectWorth,
    },
    data.euFinanced && {
      label: locale === "hr" ? "Iznos koji sufinancira EU" : "EU Financed",
      value: data.euFinanced,
    },
    data.timeOfProject && {
      label: locale === "hr" ? "Razdoblje provedbe projekta" : "Time of Project",
      value: data.timeOfProject,
    },
    data.contact && {
      label: locale === "hr" ? "Kontakt za više informacija" : "Contact",
      value: data.contact,
      href: `mailto:${data.contact}`,
    },
    ...(data.usefulLinks?.map((link) => ({
      label: locale === "hr" ? "Korisni linkovi" : "Useful Links",
      value: link.label,
      href: link.url,
      external: true,
    })) ?? []),
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }>;

  return (
    <main>
      {/* Heading */}
      <section
        className="
          content-wrapper
          pt-[120px] md:pt-[144px] lg:pt-[154px] xl:pt-[270px]
          pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[328px]
          pb-[24px] md:pb-[32px] lg:pb-[40px] xl:pb-[105px]
        "
      >
        <h1
          className="
            text-[36px] md:text-[48px] lg:text-[56px] xl:text-[66px]
            leading-[100%] text-text-primary
          "
        >
          {data.heading}
        </h1>
      </section>

      {/* Description */}
      {data.description?.length > 0 && (
        <section
          className="
            content-wrapper
            pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[328px]
            pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[408px]
            pb-[24px] md:pb-[38px] lg:pb-[54px] xl:pb-[47px]
          "
        >
          <BlocksRenderer
            content={data.description}
            className="text-[16px] leading-[23px] xl:text-[20px] xl:leading-[28px] text-text-primary"
          />
        </section>
      )}

      {/* Content Blocks */}
      {data.contentBlocks?.map((block) => (
        <section
          key={block.id}
          className="
            content-wrapper
            pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[328px]
            pr-[12px] md:pr-[20px] lg:pr-[160px] xl:pr-[408px]
            py-[24px] md:py-[32px] xl:py-[40px]
          "
        >
          <h2 className="italic text-[20px] leading-normal text-text-primary pb-[8px] md:pb-[12px] xl:pb-[16px]">
            {block.title}
          </h2>
          <BlocksRenderer content={block.content} className="text-[16px] leading-[23px] text-text-primary" />
        </section>
      ))}

      {/* Metadata Table */}
      <section>
        {metadataRows.map((row, index) => (
          <BorderedSection
            key={`${row.label}-${index}`}
            border={`border-b border-divider ${index === 0 ? "border-t" : ""}`}
          >
            <div
              className="
                relative w-full bg-white
                min-h-[60px] md:min-h-[70px] xl:h-[80px]
                flex flex-col xl:flex-row xl:items-center
                px-[12px] md:px-[44px] lg:px-[40px] xl:px-0
                py-[16px] xl:py-0
              "
            >
              <p className="text-[16px] leading-[23px] text-text-primary xl:absolute xl:left-[22.78%]">
                {row.label}
              </p>
              {row.href ? (
                <a
                  href={row.href}
                  {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`text-[16px] leading-[23px] text-text-primary xl:absolute xl:left-[45%] ${row.external ? "underline" : ""}`}
                >
                  {row.value}
                </a>
              ) : (
                <p className="text-[16px] leading-[23px] text-text-primary xl:absolute xl:left-[45%]">
                  {row.value}
                </p>
              )}
            </div>
          </BorderedSection>
        ))}
      </section>

      {/* EU Directive */}
      {data.euDirective && (
        <section
          className="
            content-wrapper
            pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[328px]
            pr-[12px] md:pr-[20px] lg:pr-[160px] xl:pr-[408px]
            py-[40px] md:py-[50px] xl:py-[60px]
          "
        >
          {/* EU Badge */}
          <Image
            src="/eu-funded-badge.svg"
            alt={locale === "hr" ? "Financira Europska unija" : "Funded by the European Union"}
            width={363}
            height={68}
            className="w-[200px] md:w-[280px] xl:w-[363px] h-auto mb-[32px] xl:mb-[40px]"
          />
          {/* Title */}
          <p className="text-[16px] leading-[23px] xl:text-[20px] xl:leading-[28px] text-text-primary mb-[8px]">
            {data.euDirective.title}
          </p>
          {/* Disclaimer */}
          <BlocksRenderer
            content={data.euDirective.content}
            className="text-[16px] leading-[23px] xl:text-[20px] xl:leading-[28px] text-[#636363]"
          />
        </section>
      )}
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlocksRenderer } from "@/components/blocks-renderer";
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

  const sectionHeadingClass =
    "text-[20px] leading-[28px] lg:text-[28px] lg:leading-[38px] text-text-primary";

  const sectionPaddingClass =
    "pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px] pr-[12px] md:pr-[20px]";

  const blockTextClass = "text-[16px] leading-[23px] text-text-primary";

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
          {data.heading}
        </h1>
      </section>

      {/* Description */}
      {data.description?.length > 0 && (
        <section
          className="
            pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
            pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
            pb-[24px] md:pb-[38px] lg:pb-[54px] xl:pb-[47px]
          "
        >
          <BlocksRenderer content={data.description} className={blockTextClass} />
        </section>
      )}

      {/* Content Blocks */}
      {data.contentBlocks?.map((block) => (
        <section key={block.id} className={`${sectionPaddingClass} py-[24px] md:py-[32px] xl:py-[40px]`}>
          <h2 className={`${sectionHeadingClass} pb-[16px] md:pb-[24px]`}>
            {block.title}
          </h2>
          <BlocksRenderer content={block.content} className={blockTextClass} />
        </section>
      ))}

      {/* Metadata Grid */}
      <section className={`${sectionPaddingClass} py-[24px] md:py-[32px] xl:py-[40px] border-t border-divider`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[24px]">
          {data.projectWorth && (
            <div>
              <p className="text-[14px] leading-[20px] text-text-secondary tracking-[0.03em] [font-variant-caps:small-caps]">
                {locale === "hr" ? "Vrijednost projekta" : "Project Worth"}
              </p>
              <p className={blockTextClass}>{data.projectWorth}</p>
            </div>
          )}
          {data.euFinanced && (
            <div>
              <p className="text-[14px] leading-[20px] text-text-secondary tracking-[0.03em] [font-variant-caps:small-caps]">
                {locale === "hr" ? "EU financiranje" : "EU Financed"}
              </p>
              <p className={blockTextClass}>{data.euFinanced}</p>
            </div>
          )}
          {data.timeOfProject && (
            <div>
              <p className="text-[14px] leading-[20px] text-text-secondary tracking-[0.03em] [font-variant-caps:small-caps]">
                {locale === "hr" ? "Trajanje projekta" : "Time of Project"}
              </p>
              <p className={blockTextClass}>{data.timeOfProject}</p>
            </div>
          )}
          {data.contact && (
            <div>
              <p className="text-[14px] leading-[20px] text-text-secondary tracking-[0.03em] [font-variant-caps:small-caps]">
                {locale === "hr" ? "Kontakt" : "Contact"}
              </p>
              <p className={blockTextClass}>
                <a href={`mailto:${data.contact}`} className="underline">
                  {data.contact}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Useful Links */}
      {data.usefulLinks?.length > 0 && (
        <section className={`${sectionPaddingClass} py-[24px] md:py-[32px] xl:py-[40px] border-t border-divider`}>
          <h2 className={`${sectionHeadingClass} pb-[16px] md:pb-[24px]`}>
            {locale === "hr" ? "Korisne poveznice" : "Useful Links"}
          </h2>
          <ul className="space-y-[8px]">
            {data.usefulLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${blockTextClass} underline`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* EU Directive */}
      {data.euDirective && (
        <section className={`${sectionPaddingClass} py-[24px] md:py-[32px] xl:py-[40px] border-t border-divider`}>
          <h2 className={`${sectionHeadingClass} pb-[16px] md:pb-[24px]`}>
            {data.euDirective.title}
          </h2>
          <BlocksRenderer content={data.euDirective.content} className={blockTextClass} />
        </section>
      )}
    </main>
  );
}

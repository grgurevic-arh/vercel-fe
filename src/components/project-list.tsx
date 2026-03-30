import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import type { NormalizedProjectListing } from "@/lib/project-helpers";
import { t } from "@/lib/translations";

interface ProjectListProps {
  locale: string;
  projects: NormalizedProjectListing[];
  emptyMessage?: string;
}

export function ProjectList({
  locale,
  projects,
  emptyMessage,
}: ProjectListProps) {
  if (!projects.length) {
    return (
      <p className="content-wrapper text-[16px] leading-[23px] text-text-primary pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px] py-[40px] md:py-[60px] xl:py-[80px]">
        {emptyMessage ?? t(locale as Locale).fallbacks.noProjects}
      </p>
    );
  }

  const gridClassName = `
    content-wrapper
    flex items-center h-[60px] md:h-[80px]
    text-[16px] leading-[23px] text-text-primary
    [font-feature-settings:'onum'_1,'pnum'_1]
    pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
    pr-[12px] md:pr-[44px] lg:pr-[86px] xl:pr-[173px]
  `;

  return (
    <ul className="border-t border-divider">
      {projects.map((project) => {
        const year = project.year ?? "\u2014";
        const discipline = project.discipline ?? "";
        const title = project.title;
        const location = project.location ?? "";
        const size = project.size ?? "";
        const disabled = project.disableRedirect === true;

        const cells = (
          <>
            <span className="w-[37px] md:w-[33px] lg:w-[90px] xl:w-[90px] mr-[40px] md:mr-[25px] lg:mr-[30px] xl:mr-[70px] text-center lg:text-left">{year}</span>
            <span className="w-[130px] mr-[39px] md:mr-[44px] lg:mr-[50px] xl:mr-[30px] hidden md:inline lowercase [font-variant-caps:small-caps] tracking-[0.48px] truncate">
              {discipline}
            </span>
            <span className="md:w-[438px] lg:w-[344px] xl:w-[384px] lg:mr-[16px] xl:mr-[96px] truncate">
              {title}
            </span>
            <span className="hidden lg:w-[238px] xl:w-[379px] lg:flex flex-row justify-between">
              <span className=" truncate">{location}</span>
              <span className="text-right truncate">
                {size}
              </span>
            </span>
          </>
        );

        return (
          <li
            key={`${project.slug}-${project.id}`}
            className={`border-b border-divider transition-colors ${
              disabled ? "" : "hover:bg-gray-50"
            }`}
          >
            {disabled ? (
              <div className={gridClassName}>{cells}</div>
            ) : (
              <Link
                href={`/${locale}/work/${project.slug}`}
                className={`${gridClassName}
                  focus-visible:outline
                  focus-visible:outline-offset-2 focus-visible:outline-black
                `}
              >
                {cells}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

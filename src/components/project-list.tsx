import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import type { NormalizedProjectListing } from "@/lib/project-helpers";
import { t } from "@/lib/translations";

interface ProjectListProps {
  locale: string;
  projects: NormalizedProjectListing[];
  emptyMessage?: string;
}

export function ProjectList({ locale, projects, emptyMessage }: ProjectListProps) {
  if (!projects.length) {
    return (
      <p className="content-wrapper text-[16px] leading-[23px] text-text-primary pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]">
        {emptyMessage ?? t(locale as Locale).fallbacks.noProjects}
      </p>
    );
  }

  return (
    <ul className="border-t border-divider">
      {projects.map((project) => {
        const year = project.year ?? "\u2014";
        const discipline = project.discipline ?? "";
        const title = project.title;
        const location = project.location ?? "";
        const size = project.size ?? "";
        const href = `/${locale}/work/${project.slug}`;

        return (
          <li
            key={`${project.slug}-${project.id}`}
            className="border-b border-divider hover:bg-gray-50 transition-colors"
          >
            <Link
              href={href}
              className="
                content-wrapper
                flex items-center h-[60px] md:h-[80px]
                text-[16px] leading-[23px] text-text-primary
                [font-feature-settings:'onum'_1,'pnum'_1]
                pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                pr-[12px] md:pr-[44px] lg:pr-[40px] xl:pr-[88px]
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-black
              "
            >
              <span className="shrink-0 w-[77px] md:w-[58px] lg:w-[120px] xl:w-[160px]">
                {year}
              </span>
              <span className="hidden md:inline shrink-0 w-[174px] lg:w-[120px] xl:w-[160px] uppercase tracking-[0.48px]">
                {discipline}
              </span>
              <span className="shrink-0 min-w-0 flex-1 md:flex-none md:w-[220px] lg:w-[344px] xl:w-[384px] truncate">
                {title}
              </span>
              <span className="hidden lg:inline shrink-0 w-[224px] xl:w-[304px] truncate">
                {location}
              </span>
              <span className="hidden lg:inline shrink-0 w-[104px] xl:w-[144px] text-right">
                {size}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

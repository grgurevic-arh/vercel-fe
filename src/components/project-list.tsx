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
      <p className="content-wrapper text-[16px] leading-[23px] text-text-primary pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px] py-[40px] md:py-[60px] xl:py-[80px]">
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
                grid items-center h-[60px] md:h-[80px]
                text-[16px] leading-[23px] text-text-primary
                [font-feature-settings:'onum'_1,'pnum'_1]
                pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                pr-[12px] md:pr-[44px] lg:pr-[86px] xl:pr-[173px]
                grid-cols-[77px_1fr] gap-x-0
                md:grid-cols-[58px_174px_1fr] md:gap-x-0
                lg:grid-cols-[120px_120px_384px_1fr_104px] lg:gap-x-0
                xl:grid-cols-[160px_160px_480px_1fr_144px] xl:gap-x-0
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-black
              "
            >
              <span className="truncate">
                {year}
              </span>
              <span className="hidden md:inline lowercase [font-variant-caps:small-caps] tracking-[0.48px] truncate">
                {discipline}
              </span>
              <span className="truncate lg:max-w-[345px] xl:max-w-[390px]">
                {title}
              </span>
              <span className="hidden lg:inline truncate">
                {location}
              </span>
              <span className="hidden lg:inline text-right truncate">
                {size}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

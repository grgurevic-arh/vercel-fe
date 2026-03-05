import Link from "next/link";

import type { NormalizedProjectListing } from "@/lib/project-helpers";

interface ProjectListProps {
  locale: string;
  projects: NormalizedProjectListing[];
  emptyMessage?: string;
}

export function ProjectList({ locale, projects, emptyMessage }: ProjectListProps) {
  if (!projects.length) {
    return (
      <p className="text-[16px] leading-[23px] text-text-primary pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]">
        {emptyMessage ?? "No published projects yet."}
      </p>
    );
  }

  return (
    <ul className="border-t border-divider">
      {projects.map((project) => {
        const year = project.year?.toString() ?? "\u2014";
        const status = project.status ?? "";
        const title = project.title;
        const location = project.location ?? "";
        const size = project.size ?? "";
        const href = `/${locale}/work/${project.slug}`;

        return (
          <li
            key={`${project.slug}-${project.id}`}
            className="border-b border-divider"
          >
            <Link
              href={href}
              className="
                flex items-baseline gap-x-[24px] md:gap-x-[40px] lg:gap-x-[48px]
                text-[16px] leading-[23px] text-text-primary
                [font-feature-settings:'onum'_1,'pnum'_1]
                py-[12px] md:py-[14px] xl:py-[16px]
                pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                pr-[12px] md:pr-[44px] lg:pr-[40px] xl:pr-[88px]
                hover:bg-gray-50 transition-colors
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-black
              "
            >
              <span className="shrink-0 w-[48px]">
                {year}
              </span>
              <span className="hidden md:inline shrink-0 w-[96px] uppercase tracking-wide">
                {status}
              </span>
              <span className="shrink-0 min-w-0 md:w-[200px] lg:w-[240px] xl:w-[280px] truncate">
                {title}
              </span>
              <span className="hidden lg:inline flex-1 min-w-0 truncate">
                {location}
              </span>
              <span className="hidden lg:inline shrink-0 w-[80px] text-right">
                {size}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

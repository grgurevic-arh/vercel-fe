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
      <p className="text-base text-gray-500">
        {emptyMessage ?? "No published projects yet."}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {projects.map((project) => {
        const href = `/${locale}/work/${project.slug}`;
        const year = project.year ?? "Year TBD";
        const location = project.location ?? "Location TBD";
        const size = project.size ? `${project.size}` : null;
        const status = project.status ?? null;

        return (
          <li
            key={`${project.slug}-${project.id}`}
            className="rounded border border-gray-200 bg-white shadow-sm"
          >
            <Link
              href={href}
              className="block px-4 py-3 text-base text-gray-900 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <span className="font-semibold text-gray-900">{year}</span>
              {": "}
              <span className="font-semibold">{project.title}</span>
              {": "}
              <span className="text-gray-700">{location}</span>
              {size ? ` · ${size}` : ""}
              {status ? ` · ${status}` : ""}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

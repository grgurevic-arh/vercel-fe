"use server";

import { getWorkProjects } from "@/lib/cms";
import { normalizeProjectListings } from "@/lib/project-helpers";
import type { NormalizedProjectListing } from "@/lib/project-helpers";

export async function fetchWorkProjectsPage(
  locale: string,
  page: number,
): Promise<{ projects: NormalizedProjectListing[] }> {
  const response = await getWorkProjects(locale, page);
  const projects = normalizeProjectListings(response.data);
  return { projects };
}

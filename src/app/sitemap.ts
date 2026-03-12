import type { MetadataRoute } from "next";

import { allowIndexing } from "@/lib/env";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { getWorkProjects, getNewsArticles } from "@/lib/cms";

const SITE_URL = process.env.SITE_URL ?? "https://grgurevic.hr";

function localizedEntries(
  path: string,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: lastModified ?? new Date(),
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]),
      ),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!allowIndexing) return [];

  // Static pages
  const staticPaths = [
    "",
    "/work",
    "/eu-projects",
    "/news",
    "/office",
    "/legal",
    "/research",
    "/privacy-policy",
  ];

  const staticEntries = staticPaths.flatMap((path) => localizedEntries(path));

  // Dynamic pages — fetch all slugs from CMS
  // Use "en" locale; slugs are shared across locales
  const [workResponse, newsResponse] = await Promise.all([
    getWorkProjects("en", 1, 100),
    getNewsArticles("en", 1, 100),
  ]);

  const workEntries = (workResponse?.data ?? []).flatMap((p) =>
    localizedEntries(`/work/${p.attributes.slug}`),
  );

  const newsEntries = (newsResponse?.data ?? []).flatMap((a) =>
    localizedEntries(`/news/${a.attributes.slug}`),
  );

  return [...staticEntries, ...workEntries, ...newsEntries];
}

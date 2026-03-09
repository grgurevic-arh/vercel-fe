import type { MetadataRoute } from "next";

import { allowIndexing } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${process.env.SITE_URL ?? "https://grgurevic.hr"}/sitemap.xml`,
  };
}

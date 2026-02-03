import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
import { getHomepage } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomepage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const homepage = await getHomepage(locale);

  if (!homepage) {
    notFound();
  }

  return (
    <DataDump
      title="Homepage payload"
      description="Raw Strapi response for the homepage single type."
      data={homepage}
    />
  );
}

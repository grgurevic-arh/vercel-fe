import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
import { getOfficePage } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function OfficePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const office = await getOfficePage(locale);

  if (!office) {
    notFound();
  }

  return (
    <DataDump
      title="Office page"
      description="Structured content for the office single type."
      data={office}
    />
  );
}

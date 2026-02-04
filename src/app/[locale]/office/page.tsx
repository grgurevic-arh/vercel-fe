import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
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
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="Office response"
        title="Office page"
        description="Structured content for the office single type."
        data={office}
      />
    </main>
  );
}

import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getLegalPage } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LegalPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const legal = await getLegalPage(locale);

  if (!legal) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="Legal response"
        title="Legal page"
        description="Structured legal metadata to power the legal page."
        data={legal}
      />
    </main>
  );
}

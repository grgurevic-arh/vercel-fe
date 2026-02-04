import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getNewsArticles } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsListingPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const response = await getNewsArticles(locale);

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="News response"
        title="News articles"
        description="Latest news payload ordered by published date."
        data={response}
      />
    </main>
  );
}

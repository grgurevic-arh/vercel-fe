import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getNewsArticleBySlug } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const article = await getNewsArticleBySlug(locale, slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="News response"
        title={`News article – ${slug}`}
        description="Full payload for a single news entry."
        data={article}
      />
    </main>
  );
}

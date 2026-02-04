import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getWorkProjectBySlug } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const project = await getWorkProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="Work response"
        title={`Work project detail – ${slug}`}
        description="Detailed payload for an individual work project."
        data={project}
      />
    </main>
  );
}

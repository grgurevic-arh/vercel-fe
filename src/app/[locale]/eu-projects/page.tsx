import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getEuProjects } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EuProjectsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const response = await getEuProjects(locale);

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="EU projects response"
        title="EU projects list"
        description="Paginated EU projects payload from Strapi."
        data={response}
      />
    </main>
  );
}

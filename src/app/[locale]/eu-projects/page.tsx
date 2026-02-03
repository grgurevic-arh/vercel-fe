import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
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
    <DataDump
      title="EU projects list"
      description="Paginated EU projects payload from Strapi."
      data={response}
    />
  );
}

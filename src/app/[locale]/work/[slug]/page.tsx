import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
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
    <DataDump
      title={`Work project detail – ${slug}`}
      description="Detailed payload for an individual work project."
      data={project}
    />
  );
}

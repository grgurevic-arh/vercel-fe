import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
import { getEuProjectBySlug } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function EuProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const project = await getEuProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  return (
    <DataDump
      title={`EU project detail – ${slug}`}
      description="Full payload for a single EU project entry."
      data={project}
    />
  );
}

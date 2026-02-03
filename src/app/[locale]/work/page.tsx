import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
import { getWorkProjects } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function WorkListingPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const workProjects = await getWorkProjects(locale);

  return (
    <DataDump
      title="Work projects list"
      description="Paginated list response used for the work overview page."
      data={workProjects}
    />
  );
}

import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
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
    <DataDump
      title="Legal page"
      description="Structured legal metadata to power the legal page."
      data={legal}
    />
  );
}

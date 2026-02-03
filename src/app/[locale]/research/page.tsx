import { notFound } from "next/navigation";

import { DataDump } from "@/components/data-dump";
import { getResearchSettings } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResearchPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const research = await getResearchSettings(locale);

  if (!research) {
    notFound();
  }

  return (
    <DataDump
      title="Research settings"
      description="Intro copy and dynamic question set feed the future research form."
      data={research}
    />
  );
}

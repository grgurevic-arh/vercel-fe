import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getResearchSettings } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResearchPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const research = await getResearchSettings(locale);

  if (!research) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="Research response"
        title="Research settings"
        description="Intro copy and dynamic question set feed the future research form."
        data={research}
      />
    </main>
  );
}

import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
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
  const hasProjects = workProjects.data.length > 0;

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="Work response"
        title="Work projects list"
        description="Paginated list response used for the work overview page."
        data={workProjects}
      />

      {hasProjects ? (
        <section className="rounded-lg border border-dashed border-zinc-300 p-6 text-center">
          <p className="text-sm text-zinc-600">
            Project cards will render here once the UI layer is implemented.
          </p>
        </section>
      ) : (
        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">No projects yet</h1>
          <p className="text-sm text-zinc-500">
            Work projects will appear here once they are published in Strapi.
          </p>
        </section>
      )}
    </main>
  );
}

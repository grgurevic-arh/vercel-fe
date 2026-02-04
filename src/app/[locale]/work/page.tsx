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

  if (!workProjects.data.length) {
    return (
      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">No projects yet</h1>
        <p className="text-sm text-zinc-500">
          Work projects will appear here once they are published in Strapi.
        </p>
      </section>
    );
  }

  return (
    <DataDump
      title="Work projects list"
      description="Paginated list response used for the work overview page."
      data={workProjects}
    />
  );
}

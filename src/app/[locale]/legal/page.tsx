import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getLegalPage } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import type { LegalPage } from "@/types/cms";

const hasValue = (value: string | null | undefined): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LegalPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const legal = await getLegalPage(locale);

  if (!legal) {
    notFound();
  }

  const legalAttributes = requireStrapiEntity<LegalPage>(
    legal,
    "Legal entry missing attributes",
  );

  const sections = [
    {
      title: "Company info",
      description: "Board, activity, and contact details.",
      fields: [
        { label: "Board", value: legalAttributes.board },
        { label: "Activity", value: legalAttributes.activity },
        { label: "Email", value: legalAttributes.email },
        { label: "Telephone", value: legalAttributes.telephone },
      ],
    },
    {
      title: "Registration",
      description: "Official registration numbers and capital.",
      fields: [
        { label: "OIB", value: legalAttributes.oib },
        { label: "MB", value: legalAttributes.mb },
        { label: "MBS", value: legalAttributes.mbs },
        { label: "Capital", value: legalAttributes.capital },
      ],
    },
    {
      title: "Banking info",
      description: "Bank account details for payments.",
      fields: [
        { label: "BK", value: legalAttributes.bk },
        { label: "IBAN", value: legalAttributes.iban },
        { label: "SWIFT", value: legalAttributes.swift },
      ],
    },
  ];

  return (
    <main className="space-y-8 p-6">
      <RawDataAccordion
        summary="Legal response"
        title="Legal page"
        description="Structured legal metadata to power the legal page."
        data={legal}
      />

      {sections.map((section) => {
        const visibleFields = section.fields.filter((field) =>
          hasValue(field.value),
        );
        if (!visibleFields.length) {
          return null;
        }

        return (
          <section key={section.title} className="space-y-4">
            <header>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                {section.title}
              </p>
              {section.description ? (
                <p className="text-sm text-gray-600">{section.description}</p>
              ) : null}
            </header>
            <dl className="grid gap-4 md:grid-cols-2">
              {visibleFields.map((field) => (
                <div
                  key={field.label}
                  className="rounded border border-gray-200 p-4"
                >
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    {field.label}
                  </dt>
                  <dd className="mt-1 text-base text-gray-900">{field.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </main>
  );
}

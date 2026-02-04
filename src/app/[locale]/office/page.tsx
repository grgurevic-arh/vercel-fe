import Image from "next/image";
import { notFound } from "next/navigation";

import { RawDataAccordion } from "@/components/raw-data-accordion";
import { getOfficePage } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { ClientPartnerCard, OfficePage, TeamMember } from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function OfficePage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const office = await getOfficePage(locale);

  if (!office) {
    notFound();
  }

  const officeAttributes = requireStrapiEntity<OfficePage>(
    office,
    "Office entry missing attributes",
  );

  const description = officeAttributes.description;
  const teamMembers = (officeAttributes.team ?? []) as TeamMember[];
  const clientCards = (officeAttributes.clients ?? []) as ClientPartnerCard[];

  return (
    <main className="space-y-6 p-6">
      <RawDataAccordion
        summary="Office response"
        title="Office page"
        description="Structured content for the office single type."
        data={office}
      />

      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Description
        </p>
        {description ? (
          <p className="text-lg leading-relaxed text-gray-900 whitespace-pre-line">
            {description}
          </p>
        ) : (
          <p className="text-base text-gray-500">No description provided.</p>
        )}
      </section>

      <section className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-gray-500">Team</p>
        {teamMembers.length ? (
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member, index) => {
              const portraitAttributes = getStrapiMediaAttributes(
                member.portrait,
              );
              const portraitUrl = getStrapiMediaUrl(member.portrait);
              const portraitWidth = portraitAttributes?.width ?? 400;
              const portraitHeight = portraitAttributes?.height ?? 500;
              const portraitAlt =
                portraitAttributes?.alternativeText ??
                (member.name ? `${member.name} portrait` : null) ??
                "Team member portrait";

              return (
                <li
                  key={`${member.name}-${member.role}-${index}`}
                  className="flex gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm"
                >
                  {portraitUrl ? (
                    <Image
                      src={portraitUrl}
                      alt={portraitAlt}
                      width={portraitWidth}
                      height={portraitHeight}
                      sizes="(min-width: 768px) 15vw, 30vw"
                      className="h-24 w-24 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded bg-gray-100 text-xs uppercase tracking-wide text-gray-400">
                      No photo
                    </div>
                  )}

                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {member.name}
                    </p>
                    {member.role ? (
                      <p className="text-sm uppercase tracking-wide text-gray-500">
                        {member.role}
                      </p>
                    ) : null}
                    {member.title ? (
                      <p className="text-sm text-gray-600">{member.title}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-base text-gray-500">No team members to show.</p>
        )}
      </section>

      <section className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-gray-500">Clients</p>
        {clientCards.length ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {clientCards.map((client, index) => {
              const logoAttributes = getStrapiMediaAttributes(client.logo);
              const logoUrl = getStrapiMediaUrl(client.logo);
              const logoWidth = logoAttributes?.width ?? 240;
              const logoHeight = logoAttributes?.height ?? 120;
              const logoAlt =
                logoAttributes?.alternativeText ??
                (client.title ? `${client.title} logo` : null) ??
                "Client logo";
              const roleLabel =
                client.role === "partner"
                  ? "Partner"
                  : client.role === "client"
                    ? "Client"
                    : "";

              return (
                <li
                  key={`${client.title}-${client.role}-${index}`}
                  className="flex flex-col gap-3 rounded border border-gray-200 bg-white p-4 shadow-sm"
                >
                  {logoUrl ? (
                    <div className="flex h-20 items-center justify-center">
                      <Image
                        src={logoUrl}
                        alt={logoAlt}
                        width={logoWidth}
                        height={logoHeight}
                        sizes="(min-width: 768px) 20vw, 40vw"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded bg-gray-100 text-xs uppercase tracking-wide text-gray-400">
                      No logo
                    </div>
                  )}

                  <div className="space-y-1">
                    {roleLabel ? (
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {roleLabel}
                      </p>
                    ) : null}
                    <p className="text-lg font-semibold text-gray-900">
                      {client.title}
                    </p>
                    {client.subtitle ? (
                      <p className="text-sm text-gray-600">{client.subtitle}</p>
                    ) : null}
                    {client.url ? (
                      <a
                        href={client.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {client.url}
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-base text-gray-500">No clients added yet.</p>
        )}
      </section>
    </main>
  );
}

import { unwrapStrapiEntity } from "@/lib/strapi-entity";
import type { ProjectListing, StrapiData } from "@/types/cms";

export interface NormalizedProjectListing extends ProjectListing {
  id: number;
}

type MaybeWrappedProject =
  | StrapiData<ProjectListing>
  | (ProjectListing & { id?: number })
  | null
  | undefined;

const getEntryId = (entry: MaybeWrappedProject, fallback: number) => {
  if (entry && typeof entry === "object" && "id" in entry) {
    const candidateId = (entry as { id?: number }).id;
    if (typeof candidateId === "number") {
      return candidateId;
    }
  }

  return fallback;
};

export function normalizeProjectListings(
  entries?: Array<MaybeWrappedProject> | null,
): NormalizedProjectListing[] {
  if (!entries?.length) {
    return [];
  }

  return entries
    .map((entry, index) => {
      const attributes = unwrapStrapiEntity(entry);

      if (!attributes?.slug || !attributes.title) {
        return null;
      }
      const idValue = getEntryId(entry, index);

      return {
        ...attributes,
        id: idValue,
      } satisfies NormalizedProjectListing;
    })
    .filter((entry): entry is NormalizedProjectListing => entry !== null);
}

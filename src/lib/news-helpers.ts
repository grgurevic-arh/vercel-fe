import { unwrapStrapiEntity } from "@/lib/strapi-entity";
import type { NewsArticle, StrapiData } from "@/types/cms";

export interface NormalizedNewsArticle extends NewsArticle {
  id: number;
}

type MaybeWrappedNews =
  | StrapiData<NewsArticle>
  | (NewsArticle & { id?: number })
  | null
  | undefined;

const getEntryId = (entry: MaybeWrappedNews, fallback: number) => {
  if (entry && typeof entry === "object" && "id" in entry) {
    const candidateId = (entry as { id?: number }).id;
    if (typeof candidateId === "number") {
      return candidateId;
    }
  }

  return fallback;
};

const newsDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatNewsDate(value?: string | null) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return newsDateFormatter.format(date);
}

export function getNewsYear(value?: string | null) {
  if (!value) {
    return "----";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 4);
  }

  return date.getFullYear().toString();
}

/**
 * Format a date as "MM.DD" (e.g., "05.08").
 * Uses publishedAtCustom if available, falls back to publishedAt.
 */
export function formatNewsDayMonth(
  publishedAtCustom?: string | null,
  publishedAt?: string | null,
): string {
  const value = publishedAtCustom ?? publishedAt;
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day}`;
}

/**
 * Extract year from publishedAtCustom (falls back to publishedAt).
 */
export function getNewsYearFromCustom(
  publishedAtCustom?: string | null,
  publishedAt?: string | null,
): string {
  const value = publishedAtCustom ?? publishedAt;
  if (!value) return "----";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 4);

  return date.getFullYear().toString();
}

export function normalizeNewsArticles(
  entries?: Array<MaybeWrappedNews> | null,
): NormalizedNewsArticle[] {
  if (!entries?.length) {
    return [];
  }

  return entries
    .map((entry, index) => {
      const attributes = unwrapStrapiEntity(entry);

      if (!attributes?.slug) {
        return null;
      }
      const idValue = getEntryId(entry, index);

      return {
        ...attributes,
        id: idValue,
      } satisfies NormalizedNewsArticle;
    })
    .filter((entry): entry is NormalizedNewsArticle => entry !== null);
}

import type { StrapiData } from "@/types/cms";

const hasAttributesWrapper = (
  value: unknown,
): value is StrapiData<Record<string, unknown>> => {
  return (
    typeof value === "object" &&
    value !== null &&
    "attributes" in value &&
    typeof (value as StrapiData<Record<string, unknown>>).attributes === "object"
  );
};

export function unwrapStrapiEntity<T>(
  entity: StrapiData<T> | T | null | undefined,
): T | null {
  if (!entity) {
    return null;
  }

  if (hasAttributesWrapper(entity)) {
    return (entity.attributes ?? null) as T | null;
  }

  return entity as T;
}

export function requireStrapiEntity<T>(
  entity: StrapiData<T> | T | null | undefined,
  errorMessage = "Missing Strapi entity attributes",
): T {
  const unwrapped = unwrapStrapiEntity(entity);
  if (!unwrapped) {
    throw new Error(errorMessage);
  }
  return unwrapped;
}

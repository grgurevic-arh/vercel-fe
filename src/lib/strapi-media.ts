import { env } from "@/lib/env";
import type { StrapiMedia, StrapiMediaAttributes } from "@/types/cms";

type StrapiAsset = StrapiMedia | StrapiMediaAttributes | null | undefined;

const uploadsBaseUrl = env.strapiBaseUrl.replace(/\/api\/?$/, "");

const hasDataWrapper = (value: unknown): value is StrapiMedia => {
  return typeof value === "object" && value !== null && "data" in value;
};

const hasDirectAttributes = (
  value: unknown,
): value is StrapiMediaAttributes => {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in (value as Record<string, unknown>)
  );
};

export function getStrapiMediaAttributes(
  media?: StrapiAsset,
): StrapiMediaAttributes | null {
  if (!media) {
    return null;
  }

  if (hasDataWrapper(media)) {
    return media.data?.attributes ?? null;
  }

  if (hasDirectAttributes(media)) {
    return media;
  }

  return null;
}

export function getStrapiMediaUrl(media?: StrapiAsset): string | null {
  const attributes = getStrapiMediaAttributes(media);
  const mediaUrl = attributes?.url;
  if (!mediaUrl) {
    return null;
  }

  if (mediaUrl.startsWith("http")) {
    return mediaUrl;
  }

  return `${uploadsBaseUrl}${mediaUrl}`;
}

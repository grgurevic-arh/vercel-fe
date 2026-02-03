import { env } from "@/lib/env";

interface StrapiRequestOptions extends RequestInit {
  searchParams?: Record<string, string | number | boolean | undefined>;
  token?: string;
}

const baseUrl = env.strapiBaseUrl.replace(/\/$/, "");

const buildUrl = (
  path: string,
  searchParams?: Record<string, string | number | boolean | undefined>,
) => {
  const normalizedPath = path.startsWith("http")
    ? path
    : `${baseUrl}/${path.replace(/^\//, "")}`;
  const url = new URL(normalizedPath);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.append(key, String(value));
    });
  }
  return url;
};

export class StrapiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "StrapiRequestError";
  }
}

export async function strapiFetch<T>(
  path: string,
  { searchParams, headers, token, ...rest }: StrapiRequestOptions = {},
): Promise<T> {
  const authToken = token ?? env.strapiReadToken;
  if (!authToken) {
    throw new Error(
      "Missing STRAPI_READ_TOKEN environment variable. Add it to .env.local.",
    );
  }

  const url = buildUrl(path, searchParams);
  const response = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    cache: rest.cache ?? "no-store",
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => undefined);
    throw new StrapiRequestError(
      errorPayload?.error?.message ?? "Failed to fetch Strapi data",
      response.status,
      errorPayload,
    );
  }

  return response.json() as Promise<T>;
}

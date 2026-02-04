import { env } from "@/lib/env";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { StrapiRequestError, strapiFetch } from "@/lib/strapi-client";
import type {
  Homepage,
  LegalPage,
  NewsArticle,
  OfficePage,
  ProjectDetail,
  ProjectListing,
  ResearchSettings,
  ResearchSubmissionPayload,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from "@/types/cms";

const populateAll = { populate: "*" };

const emptyCollectionResponse = <T>(
  page: number,
  pageSize: number,
): StrapiCollectionResponse<T> => ({
  data: [],
  meta: {
    pagination: {
      page,
      pageSize,
      pageCount: 0,
      total: 0,
    },
  },
});

async function fetchCollectionWithFallback<T>(
  path: string,
  searchParams: Record<string, string | number | boolean | undefined>,
  pagination: { page: number; pageSize: number },
) {
  try {
    return await strapiFetch<StrapiCollectionResponse<T>>(path, {
      searchParams,
    });
  } catch (error) {
    if (error instanceof StrapiRequestError && error.status === 404) {
      return emptyCollectionResponse<T>(pagination.page, pagination.pageSize);
    }

    throw error;
  }
}

const withLocale = (
  locale: string,
): { locale: Locale } => {
  if (!isLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  return { locale };
};

const fallbackSingleResponse = <T>() => ({
  data: null,
  meta: {},
}) as StrapiSingleResponse<T>;

async function fetchSingleWithFallback<T>(
  path: string,
  locale: string,
  searchParams?: Record<string, unknown>,
) {
  try {
    return await strapiFetch<StrapiSingleResponse<T>>(path, {
      searchParams: {
        ...withLocale(locale),
        ...searchParams,
      },
    });
  } catch (error) {
    if (
      error instanceof StrapiRequestError &&
      error.status === 404 &&
      locale !== DEFAULT_LOCALE
    ) {
      return strapiFetch<StrapiSingleResponse<T>>(path, {
        searchParams: {
          ...withLocale(DEFAULT_LOCALE),
          ...searchParams,
        },
      });
    }

    if (error instanceof StrapiRequestError && error.status === 404) {
      return fallbackSingleResponse<T>();
    }

    throw error;
  }
}

export async function getHomepage(locale: string) {
  const response = await fetchSingleWithFallback<Homepage>("/homepage", locale, {
    "populate[hero][populate]": "*",
  });
  return response.data;
}

export async function getOfficePage(locale: string) {
  const response = await fetchSingleWithFallback<OfficePage>(
    "/office-page",
    locale,
    {
      "populate[team][populate]": "portrait",
      "populate[clients][populate]": "logo",
    },
  );
  return response.data;
}

export async function getLegalPage(locale: string) {
  const response = await fetchSingleWithFallback<LegalPage>(
    "/legal-page",
    locale,
  );
  return response.data;
}

export async function getResearchSettings(locale: string) {
  const response = await fetchSingleWithFallback<ResearchSettings>(
    "/research-settings",
    locale,
    {
      "populate[questions]": "*",
    },
  );
  return response.data;
}

const projectFields =
  "title,slug,year,status,location,size,program,coverImage";

export async function getWorkProjects(locale: string, page = 1, pageSize = 20) {
  return fetchCollectionWithFallback<ProjectListing>(
    "/work-projects",
    {
      ...withLocale(locale),
      "fields[work-projects]": projectFields,
      "populate[coverImage]": "*",
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "year:desc",
    },
    { page, pageSize },
  );
}

export async function getWorkProjectBySlug(locale: string, slug: string) {
  const response = await strapiFetch<StrapiCollectionResponse<ProjectDetail>>(
    "/work-projects",
    {
      searchParams: {
        ...withLocale(locale),
        ...populateAll,
        "filters[slug][$eq]": slug,
      },
    },
  );
  return response.data[0] ?? null;
}

export async function getEuProjects(locale: string, page = 1, pageSize = 20) {
  return fetchCollectionWithFallback<ProjectListing>(
    "/eu-projects",
    {
      ...withLocale(locale),
      "fields[eu-projects]": projectFields,
      "populate[coverImage]": "*",
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "year:desc",
    },
    { page, pageSize },
  );
}

export async function getEuProjectBySlug(locale: string, slug: string) {
  const response = await strapiFetch<StrapiCollectionResponse<ProjectDetail>>(
    "/eu-projects",
    {
      searchParams: {
        ...withLocale(locale),
        ...populateAll,
        "filters[slug][$eq]": slug,
      },
    },
  );
  return response.data[0] ?? null;
}

export async function getNewsArticles(
  locale: string,
  page = 1,
  pageSize = 12,
) {
  return fetchCollectionWithFallback<NewsArticle>(
    "/news-articles",
    {
      ...withLocale(locale),
      "fields[news-articles]": "title,slug,summary,publishedAt,author",
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "publishedAt:desc",
      "populate[heroImage]": "*",
    },
    { page, pageSize },
  );
}

export async function getNewsArticleBySlug(locale: string, slug: string) {
  const response = await strapiFetch<StrapiCollectionResponse<NewsArticle>>(
    "/news-articles",
    {
      searchParams: {
        ...withLocale(locale),
        ...populateAll,
        "filters[slug][$eq]": slug,
      },
    },
  );
  return response.data[0] ?? null;
}

export async function submitResearchSubmission(payload: ResearchSubmissionPayload) {
  if (!env.strapiSubmitToken) {
    throw new Error(
      "Missing STRAPI_SUBMIT_TOKEN environment variable for submissions.",
    );
  }

  return strapiFetch(
    "/research-submissions",
    {
      method: "POST",
      body: JSON.stringify({ data: payload }),
      token: env.strapiSubmitToken,
    },
  );
}

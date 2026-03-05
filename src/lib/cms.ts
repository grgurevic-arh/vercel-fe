import { env } from "@/lib/env";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { StrapiRequestError, strapiFetch } from "@/lib/strapi-client";
import { buildMediaPopulateParams } from "@/lib/strapi-populate";
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

const heroImagePopulateParams = buildMediaPopulateParams("heroImage");
const coverImagePopulateParams = buildMediaPopulateParams("coverImage");
const teamPortraitPopulateParams = buildMediaPopulateParams([
  "team",
  "portrait",
]);
const clientsLogoPopulateParams = buildMediaPopulateParams([
  "clients",
  "logo",
]);
const workProjectNestedMediaPopulate = {
  ...coverImagePopulateParams,
  "populate[heroImages][populate]": "image",
  "populate[siteImages][populate]": "image",
  "populate[floorPlans][populate]": "plan",
};

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
      ...teamPortraitPopulateParams,
      ...clientsLogoPopulateParams,
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

export async function getWorkProjects(locale: string, page = 1, pageSize = 20) {
  return fetchCollectionWithFallback<ProjectListing>(
    "/work-projects",
    {
      ...withLocale(locale),
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "year:desc",
      ...coverImagePopulateParams,
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
        "filters[slug][$eq]": slug,
        ...workProjectNestedMediaPopulate,
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
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "year:desc",
      ...coverImagePopulateParams,
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
        "filters[slug][$eq]": slug,
        ...workProjectNestedMediaPopulate,
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
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "publishedAtCustom:desc",
      ...heroImagePopulateParams,
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
        "filters[slug][$eq]": slug,
        ...heroImagePopulateParams,
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

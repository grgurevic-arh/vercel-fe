const DEFAULT_STRAPI_BASE_URL = "http://localhost:1337/api";

export const env = {
  strapiBaseUrl: process.env.STRAPI_BASE_URL ?? DEFAULT_STRAPI_BASE_URL,
  strapiReadToken: process.env.STRAPI_READ_TOKEN,
  strapiSubmitToken: process.env.STRAPI_SUBMIT_TOKEN,
};

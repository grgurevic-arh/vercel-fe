import type { Locale } from "./i18n";

const translations = {
  en: {
    siteTitle: "Grgurević & Partners",
    nav: {
      work: "Work",
      office: "Office",
      feed: "Feed",
    },
    secondaryNav: {
      research: "Research",
      euProjects: "eu projects",
      legal: "Legal",
    },
    footer: {
      legal: "Legal",
      research: "Research",
      euProjects: "eu projects",
      privacyPolicy: "Privacy policy",
    },
  },
  hr: {
    siteTitle: "Grgurević & partneri",
    nav: {
      work: "Work",       // TODO: replace with Croatian from spreadsheet
      office: "Office",   // TODO: replace with Croatian from spreadsheet
      feed: "Feed",       // TODO: replace with Croatian from spreadsheet
    },
    secondaryNav: {
      research: "Research",     // TODO: replace with Croatian from spreadsheet
      euProjects: "eu projects", // TODO: replace with Croatian from spreadsheet
      legal: "Legal",           // TODO: replace with Croatian from spreadsheet
    },
    footer: {
      legal: "Legal",              // TODO: replace with Croatian from spreadsheet
      research: "Research",        // TODO: replace with Croatian from spreadsheet
      euProjects: "eu projects",   // TODO: replace with Croatian from spreadsheet
      privacyPolicy: "Privacy policy", // TODO: replace with Croatian from spreadsheet
    },
  },
} as const;

export function t(locale: Locale) {
  return translations[locale];
}

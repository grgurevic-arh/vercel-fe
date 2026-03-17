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
      research: "Participation",
      euProjects: "EU projects",
      legal: "Impressum",
    },
    footer: {
      legal: "Impressum",
      research: "Research",
      euProjects: "EU projects",
      privacyPolicy: "Privacy",
      copyright: "Grgurević & Partners, 2026",
    },
  },
  hr: {
    siteTitle: "Grgurević & partneri",
    nav: {
      work: "Rad",       
      office: "Ured",   
      feed: "Objave",       
    },
    secondaryNav: {
      research: "Participacija",     
      euProjects: "EU projekti", 
      legal: "Impresum",           
    },
    footer: {
      legal: "Impresum",              
      research: "Participacija",        
      euProjects: "EU projekti",  
      privacyPolicy: "Privatnost",
      copyright: "Grgurević & partneri, 2026",
    },
  },
} as const;

export function t(locale: Locale) {
  return translations[locale];
}

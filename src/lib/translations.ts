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
    pages: {
      work: "Work",
      office: "Office",
      news: "News",
      legal: "Impressum",
      research: "Research",
      euProjects: "EU Projects",
      privacyPolicy: "Privacy Policy",
      thankYou: "Thank You",
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
    pages: {
      work: "Projekti",
      office: "Ured",
      news: "Novosti",
      legal: "Impresum",
      research: "Istraživanje",
      euProjects: "EU projekti",
      privacyPolicy: "Politika privatnosti",
      thankYou: "Hvala",
    },
  },
} as const;

export function t(locale: Locale) {
  return translations[locale];
}

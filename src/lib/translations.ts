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
      research: "Participation",
      euProjects: "EU projects",
      privacyPolicy: "Privacy",
      copyright: "Grgurević & Partners, 2026",
    },
    pages: {
      work: "Work",
      office: "Office",
      news: "News",
      legal: "Impressum",
      research: "Participation",
      euProjects: "EU Projects",
      privacyPolicy: "Privacy",
      thankYou: "Thank You",
      yourOpinion: "Your opinion",
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
      work: "Rad",
      office: "Ured",
      news: "Objave",
      legal: "Impresum",
      research: "Participacija",
      euProjects: "EU projekti",
      privacyPolicy: "Privatnost",
      thankYou: "Hvala Vam",
      yourOpinion: "Vaše mišljenje",
    },
  },
} as const;

export function t(locale: Locale) {
  return translations[locale];
}

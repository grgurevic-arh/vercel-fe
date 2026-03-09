import type { Locale } from "@/lib/i18n";

export interface StrapiMetaPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponseMeta {
  pagination?: StrapiMetaPagination;
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

export interface StrapiSingleResponse<T> {
  data: StrapiData<T> | null;
  meta: StrapiResponseMeta;
}

export interface StrapiCollectionResponse<T> {
  data: Array<StrapiData<T>>;
  meta: StrapiResponseMeta;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string | null;
  url: string;
}

export interface StrapiMediaAttributes {
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  mime: string;
  formats?: Record<string, StrapiMediaFormat> | null;
}

export interface StrapiMedia {
  data: StrapiData<StrapiMediaAttributes> | null;
}

export interface LocalizedEntity {
  locale: Locale;
  localizations?: {
    data: Array<StrapiData<{ locale: Locale; slug?: string | null }>>;
  };
}

export interface ImageWithCaption {
  caption: string | null;
  description: string | null;
  alternativeText: string | null;
  image: StrapiMedia;
}

export interface TeamMember {
  name: string;
  role: string;
  title: string | null;
  portrait: StrapiMedia;
}

export interface ClientPartnerCard {
  role: "client" | "partner";
  title: string;
  subtitle: string | null;
  url: string | null;
  logo: StrapiMedia;
}

export interface BlockText {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface BlockHeading {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: BlockText[];
}

export interface BlockParagraph {
  type: "paragraph";
  children: BlockText[];
}

export interface BlockListItem {
  type: "list-item";
  children: BlockText[];
}

export interface BlockList {
  type: "list";
  format: "ordered" | "unordered";
  children: BlockListItem[];
}

export interface BlockQuote {
  type: "quote";
  children: BlockText[];
}

export interface BlockCode {
  type: "code";
  children: BlockText[];
}

export interface BlockImage {
  type: "image";
  image: {
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
}

export type Block =
  | BlockHeading
  | BlockParagraph
  | BlockList
  | BlockQuote
  | BlockCode
  | BlockImage;

export interface Homepage extends LocalizedEntity {
  heading: string | null;
  content: Block[] | null;
  hero: ImageWithCaption[];
}

export interface ProjectListing extends LocalizedEntity {
  title: string;
  slug: string;
  year: number | null;
  status: string | null;
  location: string | null;
  size: string | null;
  coverImage: StrapiMedia;
  program?: string | null;
}

export interface ProjectDetail extends ProjectListing {
  heading: string | null;
  description: string | null;
  completed: string | null;
  grossArea: string | null;
  investor: string | null;
  projectCode: string | null;
  siteArea: string | null;
  investmentValue: string | null;
  heroImages: ImageWithCaption[];
  siteImages: Array<{ image: StrapiMedia; description: string | null }>;
  floorPlans: Array<{ plan: StrapiMedia; label: string | null }>;
}

export interface NewsArticle extends LocalizedEntity {
  title: string;
  summary: string | null;
  slug: string;
  author: string | null;
  publishedAt: string;
  publishedAtCustom: string | null;
  body: string | null;
  heroImage: StrapiMedia;
}

export interface OfficePage extends LocalizedEntity {
  description: string | null;
  team: TeamMember[];
  clients: ClientPartnerCard[];
}

export interface LegalPage extends LocalizedEntity {
  name: string | null;
  location: string | null;
  tel: string | null;
  email: string | null;
  oib: string | null;
  board: string | null;
  mbs: string | null;
  mb: string | null;
  shareCapital: string | null;
  bank: string | null;
  iban: string | null;
  swift: string | null;
  vatId: string | null;
  foto: string | null;
  website: string | null;
}

export interface PrivacyPolicy extends LocalizedEntity {
  content: Block[];
}

export interface Footer extends LocalizedEntity {
  companyName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export type ResearchInputType = "text" | "textarea" | "select" | "number" | "date";

export interface ResearchQuestion {
  questionId: string;
  prompt: string;
  inputType: ResearchInputType;
  required: boolean;
  placeholder: string | null;
  options: string[] | null;
}

export interface ResearchSettings extends LocalizedEntity {
  intro: string | null;
  questions: ResearchQuestion[];
}

export interface ResearchAnswerPayload {
  questionId: string;
  prompt: string;
  value: string;
}

export interface ResearchSubmissionPayload {
  locale: Locale;
  answers: ResearchAnswerPayload[];
  metadata?: Record<string, unknown>;
}

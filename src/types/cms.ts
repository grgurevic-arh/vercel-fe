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
  year: string | null;
  discipline: string | null;
  location: string | null;
  size: string | null;
  heroImages: ImageWithCaption[];
}

export interface ProjectDetail extends ProjectListing {
  projectCode: string | null;
  heading: string | null;
  description: Block[] | null;
  projectStatus: string | null;
  completed: string | null;
  investor: string | null;
  projectLength: string | null;
  siteArea: string | null;
  investmentValue: string | null;
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

export interface EuContentBlock {
  id: number;
  title: string;
  content: Block[];
}

export interface EuUsefulLink {
  id: number;
  label: string;
  url: string;
}

export interface EuProjectPage extends LocalizedEntity {
  heading: string;
  description: Block[];
  contentBlocks: EuContentBlock[];
  projectWorth: string;
  euFinanced: string;
  timeOfProject: string;
  contact: string;
  usefulLinks: EuUsefulLink[];
  euDirective: EuContentBlock;
}

export interface PollQuestion {
  id: number;
  questionId: string;
  prompt: string;
  inputType: "text" | "textarea" | "select";
  required: boolean;
  options: Array<{ label: string; value: string }> | null;
  placeholder: string | null;
}

export interface EntryPoll extends LocalizedEntity {
  documentId: string;
  slug: string;
  projectName: string;
  description: string | null;
  status: "open";
  requiresAccessCode: boolean;
  questions: PollQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface PollAnswer {
  questionId: string;
  value: string;
}

export interface PollSubmissionPayload {
  entryPoll: string;
  locale: "en" | "hr";
  answers: PollAnswer[];
  accessCode?: string;
  metadata?: Record<string, unknown>;
}

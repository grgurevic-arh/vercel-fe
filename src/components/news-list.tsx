import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import {
  formatNewsDayMonth,
  getNewsYearFromCustom,
  type NormalizedNewsArticle,
} from "@/lib/news-helpers";
import { t } from "@/lib/translations";

interface NewsListProps {
  locale: string;
  articles: NormalizedNewsArticle[];
  emptyMessage?: string;
}

export function NewsList({ locale, articles, emptyMessage }: NewsListProps) {
  if (!articles.length) {
    return (
      <p className="content-wrapper text-[16px] leading-[23px] text-text-primary pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px] py-[40px] md:py-[60px] xl:py-[80px]">
        {emptyMessage ?? t(locale as Locale).fallbacks.noNews}
      </p>
    );
  }

  return (
    <ul className="border-t border-divider">
      {articles.map((article) => {
        const year = getNewsYearFromCustom(
          article.publishedAtCustom,
          article.publishedAt,
        );
        const dayMonth = formatNewsDayMonth(
          article.publishedAtCustom,
          article.publishedAt,
        );
        const title = article.title ?? t(locale as Locale).fallbacks.untitledArticle;
        const summary = article.summary ?? "";
        const href = `/${locale}/news/${article.slug}`;

        return (
          <li
            key={`${article.slug}-${article.id}`}
            className="border-b border-divider hover:bg-gray-50 transition-colors"
          >
            <Link
              href={href}
              className="
                content-wrapper
                flex items-baseline gap-x-[24px] md:gap-x-[40px] lg:gap-x-[48px]
                text-[16px] leading-[23px] text-text-primary
                [font-feature-settings:'onum'_1,'pnum'_1]
                py-[12px] md:py-[14px] xl:py-[16px]
                pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                pr-[12px] md:pr-[44px] lg:pr-[40px] xl:pr-[88px]
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
              "
            >
              <span className="hidden lg:inline shrink-0 w-[48px]">
                {year}
              </span>
              <span className="shrink-0 w-[48px] xl:w-[160px]">{dayMonth}</span>
              <span className="min-w-0 flex-1 md:flex-none md:shrink-0 md:w-[200px] lg:w-[240px] xl:w-[384px] line-clamp-2 md:truncate md:line-clamp-none">
                {title}
              </span>
              <span className="hidden lg:inline flex-1 min-w-0 truncate">
                {summary}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

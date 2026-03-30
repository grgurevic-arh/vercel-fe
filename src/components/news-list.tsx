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
        const title =
          article.title ?? t(locale as Locale).fallbacks.untitledArticle;
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
                flex items-baseline
                text-[16px] leading-[23px] text-text-primary
                [font-feature-settings:'onum'_1,'pnum'_1]
                py-[12px] md:py-[14px] xl:py-[16px]
                pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                pr-[13px] md:pr-[102px] lg:pr-[100px] xl:pr-[168px]
                focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black
              "
            >
              <span className="hidden lg:inline w-[33px] lg:mr-[87px] xl:mr-[127px]">{year}</span>
              <span className="w-[38px] mr-[39px] md:mr-[78px] lg:mr-[82px] xl:mr-[122px]">{dayMonth}</span>
              <span className="w-full md:w-[506px] lg:w-[344px] xl:w-[464px] md:mr-[16px] line-clamp-2 md:truncate md:line-clamp-none">
                {title}
              </span>
              <span className="hidden lg:inline flex-1 min-w-0 w-[284px] xl:w-[384px] truncate">
                {summary}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

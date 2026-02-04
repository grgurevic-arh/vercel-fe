import Link from "next/link";

import {
  formatNewsDate,
  getNewsYear,
  type NormalizedNewsArticle,
} from "@/lib/news-helpers";

interface NewsListProps {
  locale: string;
  articles: NormalizedNewsArticle[];
  emptyMessage?: string;
}

export function NewsList({ locale, articles, emptyMessage }: NewsListProps) {
  if (!articles.length) {
    return (
      <p className="text-base text-gray-500">
        {emptyMessage ?? "No news entries available."}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {articles.map((article) => {
        const yearLabel = getNewsYear(article.publishedAt);
        const dateLabel = formatNewsDate(article.publishedAt);
        const title = article.title ?? "Untitled article";
        const summary = article.summary ?? "No summary provided.";
        const href = `/${locale}/news/${article.slug}`;

        return (
          <li
            key={`${article.slug}-${article.id}`}
            className="rounded border border-gray-200 bg-white shadow-sm"
          >
            <Link
              href={href}
              className="block px-4 py-3 text-base text-gray-900 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <span className="font-semibold text-gray-900">{yearLabel}</span>
              {": "}
              {dateLabel}
              {": "}
              <span className="font-semibold">{title}</span>
              {": "}
              <span className="text-gray-700">{summary}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

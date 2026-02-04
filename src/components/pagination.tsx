import Link from "next/link";

interface PaginationProps {
  locale: string;
  currentPage: number;
  pageCount: number;
  basePath?: string;
}

export function Pagination({
  locale,
  currentPage,
  pageCount,
  basePath = "/news",
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const pathname = `/${locale}${basePath}`;

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
      {pages.map((page) => {
        const isActive = page === currentPage;
        const query = page === 1 ? {} : { page: page.toString() };
        const href = {
          pathname,
          query,
        };

        return (
          <Link
            key={page}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`w-10 rounded border px-3 py-1 text-center text-sm font-medium transition ${isActive ? "border-black bg-black text-white" : "border-gray-300 text-gray-700 hover:border-black"}`}
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
}

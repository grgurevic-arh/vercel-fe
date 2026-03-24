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
    <div className="border-b border-divider">
      <nav
        className="
          content-wrapper
          flex flex-wrap items-end
          h-[210px] lg:h-[340px]
          pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[248px]
          pb-[89px]
          gap-x-[24px] md:gap-x-[58px] lg:gap-x-[60px] xl:gap-x-[80px]
        "
        aria-label="Pagination"
      >
        {pages.map((page) => {
          const isActive = page === currentPage;
          const query = page === 1 ? {} : { page: page.toString() };
          const href = { pathname, query };

          return (
            <Link
              key={page}
              href={href}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={`
                text-[21px] leading-[100%] text-text-primary
                [font-feature-settings:'lnum'_1,'tnum'_1]
                ${isActive ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4"}
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
              `}
            >
              {page}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

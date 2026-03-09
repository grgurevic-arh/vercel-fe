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
    <nav
      className="
        flex items-center gap-[24px] md:gap-[32px]
        pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
        pt-[48px] md:pt-[64px] lg:pt-[80px] xl:pt-[96px]
        pb-[48px] md:pb-[64px] lg:pb-[80px] xl:pb-[96px]
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
  );
}

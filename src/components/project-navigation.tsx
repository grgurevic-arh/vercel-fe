import Link from "next/link";

interface ProjectNavigationProps {
  locale: string;
  previousSlug: string;
  nextSlug: string;
}

export function ProjectNavigation({
  locale,
  previousSlug,
  nextSlug,
}: ProjectNavigationProps) {
  const prevHref = `/${locale}/work/${previousSlug}`;
  const allHref = `/${locale}/work`;
  const nextHref = `/${locale}/work/${nextSlug}`;

  return (
    <nav
      className="
        content-wrapper
        flex items-baseline justify-between
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        pt-[60px] md:pt-[80px] lg:pt-[100px]
        pb-[60px] md:pb-[80px] lg:pb-[100px]
        text-[16px] leading-[23px] text-text-primary
      "
      aria-label="Project navigation"
    >
      <Link
        href={prevHref}
        className="
          hover:underline
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-black
        "
      >
        <span className="md:hidden">&larr;</span>
        <span className="hidden md:inline">Previous project</span>
      </Link>

      <Link
        href={allHref}
        className="
          hover:underline
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-black
        "
      >
        All work
      </Link>

      <Link
        href={nextHref}
        className="
          underline
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-black
        "
      >
        <span className="md:hidden">&rarr;</span>
        <span className="hidden md:inline">Next project</span>
      </Link>
    </nav>
  );
}

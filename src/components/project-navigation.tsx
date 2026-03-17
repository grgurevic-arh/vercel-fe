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
  const hr = locale === "hr";
  const prevHref = `/${locale}/work/${previousSlug}`;
  const allHref = `/${locale}/work`;
  const nextHref = `/${locale}/work/${nextSlug}`;

  const prevLabel = hr ? "Prethodni projekt" : "Previous project";
  const allLabel = hr ? "Svi radovi" : "All work";
  const nextLabel = hr ? "Sljedeći projekt" : "Next project";

  return (
    <nav
      className="border-t border-b border-divider"
      aria-label="Project navigation"
    >
      <div
        className="
          content-wrapper relative
          h-[132px] md:h-[240px] lg:h-[444px] xl:h-[544px]
        "
      >
        {/* Previous project */}
        <Link
          href={prevHref}
          className="
            absolute
            left-[12px] md:left-[44px] lg:left-[40px] xl:left-[88px]
            top-[52px] md:top-[101px] lg:top-[203px] xl:top-[253px]
            text-[20px] leading-[28px]
            md:text-[28px] md:leading-[38px]
            text-text-primary
            [font-feature-settings:'onum'_1,'pnum'_1]
            hover:underline
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-black
          "
        >
          <span className="md:hidden">&larr;</span>
          <span className="hidden md:inline">{prevLabel}</span>
        </Link>

        {/* All work */}
        <Link
          href={allHref}
          className="
            absolute
            left-1/2 -translate-x-1/2
            top-[52px] md:top-[101px] lg:top-[203px] xl:top-[253px]
            text-[20px] leading-[28px]
            md:text-[28px] md:leading-[38px]
            text-text-primary
            [font-feature-settings:'onum'_1,'pnum'_1]
            hover:underline
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-black
          "
        >
          {allLabel}
        </Link>

        {/* Next project */}
        <Link
          href={nextHref}
          className="
            absolute
            right-[12px] md:right-[44px] lg:right-[40px] xl:right-[88px]
            top-[52px] md:top-[101px] lg:top-[203px] xl:top-[253px]
            text-[20px] leading-[28px]
            md:text-[28px] md:leading-[38px]
            text-text-primary
            [font-feature-settings:'onum'_1,'pnum'_1]
            hover:underline
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-black
          "
        >
          <span className="md:hidden">&rarr;</span>
          <span className="hidden md:inline">{nextLabel}</span>
        </Link>
      </div>
    </nav>
  );
}

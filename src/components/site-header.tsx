import Link from "next/link";

interface SiteHeaderProps {
  locale: string;
}

const navLinks = [
  { label: "Work", path: "/work" },
  { label: "Office", path: "/office" },
  { label: "Feed", path: "/news" },
];

export function SiteHeader({ locale }: SiteHeaderProps) {
  return (
    <header
      className="
        flex items-center justify-between
        border-b-[0.5px] border-[var(--divider)] bg-white
        h-[54px] xl:h-[80px]
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
      "
    >
      <Link
        href={`/${locale}`}
        className="
          text-[16px] leading-[23px] xl:text-[20px] xl:leading-[28px]
          text-[var(--text-primary)]
        "
      >
        Grgurević &amp; partneri
      </Link>

      {/* Desktop nav (768px+) */}
      <nav className="hidden md:flex items-center gap-[16px] lg:gap-[20px] xl:gap-[24px]">
        {navLinks.map(({ label, path }) => (
          <Link
            key={path}
            href={`/${locale}${path}`}
            className="
              text-[16px] leading-[23px] xl:text-[20px] xl:leading-[28px]
              text-[var(--text-primary)] py-[8px]
            "
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu button (< 768px) */}
      <button
        type="button"
        className="
          md:hidden
          text-[16px] leading-[23px] text-[var(--text-primary)] py-[8px]
        "
      >
        Menu
      </button>
    </header>
  );
}

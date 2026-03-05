import Link from "next/link";

export interface FeedItem {
  title: string;
  summary: string | null;
  slug: string;
}

interface HomepageFeedProps {
  locale: string;
  items: FeedItem[];
}

export function HomepageFeed({ locale, items }: HomepageFeedProps) {
  if (!items.length) return null;

  return (
    <section>
      <ul
        className="
          pl-[12px] md:pl-[160px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[46px] lg:pr-[160px] xl:pr-[248px]
          space-y-[96px] md:space-y-[56px] lg:space-y-[90px] xl:space-y-[78px]
        "
      >
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${locale}/news/${item.slug}`}
              className="group block"
            >
              <h3
                className="
                  text-[20px] leading-[28px]
                  md:text-[20px] md:leading-[28px]
                  lg:text-[26px] lg:leading-[36px] lg:tracking-[1px]
                  xl:text-[28px] xl:leading-[38px]
                  text-text-primary
                  group-hover:underline
                "
              >
                {item.title}
              </h3>
              {item.summary ? (
                <p
                  className="
                    mt-[10px] md:mt-[12px]
                    text-[16px] leading-[23px]
                    md:text-[20px] md:leading-[28px]
                    lg:text-[26px] lg:leading-[36px]
                    xl:text-[28px] xl:leading-[38px]
                    text-text-primary
                  "
                >
                  {item.summary}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

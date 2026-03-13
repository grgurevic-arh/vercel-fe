import type { Metadata } from "next";
import Link from "next/link";

import { resolveLocaleParam } from "@/lib/request-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);

  return {
    title: locale === "hr" ? "Hvala" : "Thank You",
  };
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ThankYouPage({ params }: PageProps) {
  const locale = await resolveLocaleParam(params);

  return (
    <main>
      <section
        className="
          pt-[120px] md:pt-[148px] lg:pt-[148px] xl:pt-[180px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[80px] md:pb-[120px] lg:pb-[140px] xl:pb-[180px]
        "
      >
        <h1
          className="
            pb-[16px] md:pb-[24px]
            text-[20px] leading-[28px]
            [font-feature-settings:'onum'_1,'pnum'_1]
            min-[320px]:text-[28px] min-[320px]:leading-[38px]
            md:text-[38px] md:leading-[50px]
            md:[font-feature-settings:normal]
            text-text-primary
          "
        >
          {locale === "hr" ? "Hvala na sudjelovanju!" : "Thank you for participating!"}
        </h1>

        <p
          className="
            pb-[32px] md:pb-[40px]
            text-[16px] leading-[23px]
            md:text-[20px] md:leading-[28px]
            text-text-primary/70
          "
        >
          {locale === "hr"
            ? "Vaši odgovori su uspješno zabilježeni."
            : "Your responses have been recorded successfully."}
        </p>

        <Link
          href={`/${locale}/research`}
          className="
            text-[16px] leading-[23px]
            md:text-[20px] md:leading-[28px]
            text-text-primary
            underline
            hover:opacity-80
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
          "
        >
          {locale === "hr" ? "← Natrag na ankete" : "← Back to polls"}
        </Link>
      </section>
    </main>
  );
}

"use client";

import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/translations";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale ?? "en") as Locale;
  const trans = t(locale);

  return (
    <main>
      <section
        className="
          content-wrapper
          pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[328px]
          pt-[86px] md:pt-[184px] lg:pt-[216px] xl:pt-[190px]
        "
      >
        <h1
          className="
            text-[28px] leading-[38px]
            md:text-[38px] md:leading-[50px]
            lg:text-[66px] lg:leading-[normal]
            text-text-primary
          "
        >
          {trans.pages.somethingWentWrong}
        </h1>

        <p
          className="
            mt-[16px] md:mt-[16px] lg:mt-[16px]
            text-[16px] leading-[23px]
            md:text-[20px] md:leading-[28px]
            lg:text-[28px] lg:leading-[38px]
            text-text-primary
            max-w-[296px] md:max-w-[448px] lg:max-w-[784px]
          "
        >
          {trans.pages.unexpectedError}
        </p>

        <button
          onClick={reset}
          className="
            mt-[62px] md:mt-[62px] lg:mt-[120px]
            text-[16px] leading-[23px]
            lg:text-[22px] lg:leading-[32px]
            text-[var(--text-secondary,#636363)]
            underline underline-offset-4
          "
        >
          {trans.pages.tryAgain}
        </button>
      </section>
    </main>
  );
}

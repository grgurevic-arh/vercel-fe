import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import type { LegalPage } from "@/types/cms";

interface ImpressumDetailsProps {
  locale: Locale;
  data: LegalPage;
}

interface Row {
  label: string;
  value: string;
}

const hasValue = (value: string | null): value is string =>
  value != null && value.trim().length > 0;

// Uppercase tokens (LTD, HR-10000, ESBCHR22, EUR...) render as small caps
const ABBR_SPLIT = /(\b[A-Z]{2}[A-Z0-9]*\b)/;
const ABBR_MATCH = /^[A-Z]{2}[A-Z0-9]*$/;

function SmallCapsValue({ text }: { text: string }) {
  return (
    <>
      {text.split(ABBR_SPLIT).map((part, i) =>
        ABBR_MATCH.test(part) ? (
          <span key={i} className="lowercase [font-variant-caps:small-caps]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function ImpressumDetails({ locale, data }: ImpressumDetailsProps) {
  const labels = t(locale).impressum;

  const rawGroups: { label: string; value: string | null }[][] = [
    [
      { label: labels.registeredName, value: data.name },
      { label: labels.registeredOffice, value: data.location },
      { label: labels.tel, value: data.tel },
      { label: labels.email, value: data.email },
      { label: labels.oib, value: data.oib },
      { label: labels.board, value: data.board },
      { label: labels.mbs, value: data.mbs },
      { label: labels.mb, value: data.mb },
    ],
    [
      { label: labels.shareCapital, value: data.shareCapital },
      { label: labels.bank, value: data.bank },
      { label: labels.iban, value: data.iban },
      { label: labels.swift, value: data.swift },
      { label: labels.vatId, value: data.vatId },
    ],
    [
      { label: labels.website, value: data.website },
      { label: labels.photos, value: data.foto },
    ],
  ];

  const groups: Row[][] = rawGroups.map((group) =>
    group.filter((row): row is Row => hasValue(row.value)),
  );

  if (!groups.some((group) => group.length > 0)) return null;

  return (
    <section className="bg-white border-t border-divider">
      <div
        className="
          content-wrapper
          pt-[54px] md:pt-[100px] lg:pt-[120px] xl:pt-[152px]
          pb-[90px] md:pb-[124px] lg:pb-[154px] xl:pb-[216px]
          pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[328px]
          pr-[12px] md:pr-[44px] lg:pr-[160px] xl:pr-[248px]
        "
      >
        {groups
          .filter((group) => group.length > 0)
          .map((group, groupIndex) => (
            <div
              key={group[0].label}
              className={groupIndex > 0 ? "mt-[32px] md:mt-[23px]" : ""}
            >
              {group.map((row) => (
                <div
                  key={row.label}
                  className="
                    mb-[12px] last:mb-0 md:mb-0
                    md:flex md:gap-x-[16px]
                    text-[16px] leading-[23px] text-text-primary
                  "
                >
                  <span
                    className="
                      block shrink-0
                      tracking-[0.48px] lowercase [font-variant-caps:small-caps]
                      md:w-[195px] lg:w-[243px] xl:w-[245px]
                    "
                  >
                    {row.label}
                  </span>
                  <span className="block">
                    <SmallCapsValue text={row.value} />
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
}

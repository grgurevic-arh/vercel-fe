import { Fragment } from "react";

import { BorderedSection } from "@/components/bordered-section";
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

  const groups: Row[][] = rawGroups
    .map((group) => group.filter((row): row is Row => hasValue(row.value)))
    .filter((group) => group.length > 0);

  if (groups.length === 0) return null;

  const lastGroup = groups[groups.length - 1];

  return (
    <section className="bg-white border-t border-b border-divider mb-[192px]">
      {/* Mobile: BorderedSection rows (visible only on <md) */}
      <div className="mb-[144px] md:hidden">
        {groups.map((group, groupIndex) => (
          <Fragment key={group[0].label}>
            {groupIndex > 0 && <div className="h-[32px]" />}
            {group.map((row, rowIndex) => (
              <BorderedSection
                key={row.label}
                border={
                  group === lastGroup && rowIndex === group.length - 1
                    ? ""
                    : "border-b border-divider"
                }
                className={`h-[70px] flex items-center pl-[12px] pr-[12px] ${
                  groupIndex === 0 ? "pt-[12px] pb-[14px]" : ""
                }`}
              >
                <div className="flex flex-col text-[16px] text-text-primary">
                  <span className="tracking-[0.48px] lowercase [font-variant-caps:small-caps] leading-[22px]">
                    {row.label}
                  </span>
                  <span className="leading-[23px]">
                    <SmallCapsValue text={row.value} />
                  </span>
                </div>
              </BorderedSection>
            ))}
          </Fragment>
        ))}
      </div>

      {/* md+: label/value columns in three groups */}
      <div
        className="
          hidden md:block content-wrapper
          md:pt-[100px] lg:pt-[120px] xl:pt-[152px]
          md:pb-[124px] lg:pb-[154px] xl:pb-[216px]
          md:pl-[160px] lg:pl-[160px] xl:pl-[328px]
          md:pr-[44px] lg:pr-[160px] xl:pr-[248px]
        "
      >
        {groups.map((group, groupIndex) => (
          <div
            key={group[0].label}
            className={groupIndex > 0 ? "mt-[23px]" : ""}
          >
            {group.map((row) => (
              <div
                key={row.label}
                className="
                  flex gap-x-[16px]
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

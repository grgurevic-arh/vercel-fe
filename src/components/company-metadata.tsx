import { BorderedSection } from "@/components/bordered-section";

interface CompanyMetadataProps {
  bank: string | null;
  swift: string | null;
  iban: string | null;
  oib: string | null;
  mb: string | null;
  mbs: string | null;
  vatId: string | null;
  shareCapital: string | null;
  board: string | null;
  foto: string | null;
  website: string | null;
}

const hasValue = (value: string | null): value is string =>
  value != null && value.trim().length > 0;

export function CompanyMetadata({
  bank,
  swift,
  iban,
  oib,
  mb,
  mbs,
  vatId,
  shareCapital,
  board,
  foto,
  website,
}: CompanyMetadataProps) {
  const bankingFields = [
    { label: "bank", value: bank },
    { label: "swift", value: swift },
    { label: "iban", value: iban },
    { label: "oib", value: oib },
    { label: "mb", value: mb },
    { label: "mbs", value: mbs },
    { label: "vat id", value: vatId },
  ].filter((f): f is { label: string; value: string } => hasValue(f.value));

  const companyFields = [
    { label: "capital", value: shareCapital },
    { label: "board", value: board },
    { label: "foto", value: foto },
    { label: "website", value: website },
  ].filter((f): f is { label: string; value: string } => hasValue(f.value));

  if (!bankingFields.length && !companyFields.length) return null;

  const labelBase = "shrink-0 tracking-[0.03em] [font-variant-caps:small-caps]";
  const rowBase =
    "flex gap-x-[12px] md:gap-x-[44px] text-[12px] leading-[20px] md:text-[16px] md:leading-[23px] text-text-primary";

  return (
    <section
      className="
        bg-white
        border-t border-divider
      "
    >
      {/* Mobile: BorderedSection rows (visible only on <md) */}
      <div className="mb-[144px] md:hidden">
        {bankingFields.map((f) => (
          <BorderedSection
            key={f.label}
            border="border-b border-divider"
            className="h-[70px] flex items-center pl-[12px] pr-[12px] pt-[12px] pb-[14px]"
          >
            <div className="flex flex-col text-[16px] text-text-primary">
              <span className="tracking-[0.48px] [font-variant-caps:small-caps] leading-[22px]">
                {f.label}
              </span>
              <span className="leading-[23px]">{f.value}</span>
            </div>
          </BorderedSection>
        ))}
        {companyFields.length > 0 && (
          <>
            <div className="h-[32px]" />
            {companyFields.map((f, i) => (
              <BorderedSection
                key={f.label}
                border={i < companyFields.length - 1 ? "border-b border-divider" : ""}
                className="h-[70px] flex items-center pl-[12px] pr-[12px]"
              >
                <div className="flex flex-col text-[16px] text-text-primary">
                  <span className="tracking-[0.48px] [font-variant-caps:small-caps] leading-[22px]">
                    {f.label}
                  </span>
                  <span className="leading-[23px]">{f.value}</span>
                </div>
              </BorderedSection>
            ))}
          </>
        )}
      </div>

      {/* Desktop: absolute-positioned layout (visible on md+) */}
      <div
        className="
          content-wrapper relative hidden md:block
          md:h-[522px] lg:h-[400px] xl:h-[544px]
        "
      >
        {/* Banking & Registration group */}
        <div
          className="
          absolute
          md:left-[44px] lg:left-[40px] xl:left-[87px]
          md:top-[100px] lg:top-[120px] xl:top-[152px]
        "
        >
          {bankingFields.map((f) => (
            <div key={f.label} className={rowBase}>
              <span className={`${labelBase} md:w-[80px] xl:w-[97px]`}>
                {f.label}
              </span>
              <span>{f.value}</span>
            </div>
          ))}
        </div>

        {/* Company Info group */}
        <div
          className="
          absolute
          md:left-[44px] lg:left-[540px] xl:left-[808px]
          md:top-[264px] lg:top-[120px] xl:top-[152px]
        "
        >
          {companyFields.map((f) => (
            <div key={f.label} className={rowBase}>
              <span className={`${labelBase} md:w-[80px] xl:w-[97px]`}>
                {f.label}
              </span>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

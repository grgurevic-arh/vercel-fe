interface CompanyMetadataProps {
  bk: string | null;
  swift: string | null;
  iban: string | null;
  oib: string | null;
  mb: string | null;
  mbs: string | null;
  capital: string | null;
  board: string | null;
  foto: string | null;
  activity: string | null;
}

const hasValue = (value: string | null): value is string =>
  value != null && value.trim().length > 0;

export function CompanyMetadata({
  bk,
  swift,
  iban,
  oib,
  mb,
  mbs,
  capital,
  board,
  foto,
  activity,
}: CompanyMetadataProps) {
  const bankingFields = [
    { label: "bk.", value: bk },
    { label: "swift", value: swift },
    { label: "iban", value: iban },
    { label: "oib", value: oib },
    { label: "mb", value: mb },
    { label: "mbs", value: mbs },
  ].filter((f): f is { label: string; value: string } => hasValue(f.value));

  const companyFields = [
    { label: "capital", value: capital },
    { label: "board", value: board },
    { label: "foto", value: foto },
    { label: "activity", value: activity },
  ].filter((f): f is { label: string; value: string } => hasValue(f.value));

  if (!bankingFields.length && !companyFields.length) return null;

  const labelBase =
    "shrink-0 tracking-[0.03em] [font-variant-caps:small-caps]";
  const rowBase = "flex text-[16px] leading-[23px] text-text-primary";

  return (
    <section
      className="
        relative bg-white
        border-t border-divider
        h-[430px] min-[321px]:h-[370px] md:h-[360px] lg:h-[400px] xl:h-[544px]
      "
    >
      {/* Banking & Registration group */}
      <div
        className="
          absolute
          left-[12px] md:left-[44px] lg:left-[40px] xl:left-[87px]
          top-[80px] md:top-[100px] lg:top-[120px] xl:top-[152px]
        "
      >
        {bankingFields.map((f) => (
          <div key={f.label} className={rowBase}>
            <span className={`${labelBase} w-[68px] xl:w-[80px]`}>
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
          left-[12px] md:left-[420px] lg:left-[540px] xl:left-[808px]
          top-[270px] min-[321px]:top-[218px] md:top-[100px] lg:top-[120px] xl:top-[152px]
        "
      >
        {companyFields.map((f) => (
          <div key={f.label} className={rowBase}>
            <span className={`${labelBase} w-[80px] xl:w-[97px]`}>
              {f.label}
            </span>
            <span>{f.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

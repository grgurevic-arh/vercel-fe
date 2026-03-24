interface ContactInfoProps {
  email: string | null;
  telephone: string | null;
  companyName?: string;
  address?: string;
  showTopBorder?: boolean;
  className?: string;
}

export function ContactInfo({
  email,
  telephone,
  companyName,
  address,
  showTopBorder = false,
  className,
}: ContactInfoProps) {
  return (
    <section
      className={`
        bg-white
        border-b border-divider
        ${showTopBorder ? "border-t" : ""}
        ${className ?? ""}
      `}
    >
      <div
        className="
          content-wrapper relative
          h-[340px] md:h-[434px] lg:h-[484px] xl:h-[544px]
        "
      >
      {/* Column 1: Email & Phone */}
      <div
        className="
          absolute
          left-[12px] md:left-[44px] lg:left-[40px] xl:left-[88px]
          top-[49px] md:top-[105px] lg:top-[151px] xl:top-[205px]
          text-[20px] leading-[28px]
          lg:text-[28px] lg:leading-[38px]
          xl:text-[28px] xl:leading-[38px]
          text-text-primary
        "
      >
        {email ? <p>{email}</p> : null}
        {telephone ? <p>{telephone}</p> : null}
      </div>

      {/* Column 2: Company & Address */}
      <div
        className="
          absolute
          left-[12px] md:left-[450px] lg:left-[580px] xl:left-[808px]
          top-[155px] md:top-[105px] lg:top-[151px] xl:top-[205px]
          text-[20px] leading-[28px]
          lg:text-[28px] lg:leading-[38px]
          xl:text-[28px] xl:leading-[38px]
          text-text-primary
        "
      >
        <p>
          {companyName?.split(/(\b[A-Z]{2,}\b)/).map((part, i) =>
            /^[A-Z]{2,}$/.test(part) ? (
              <span key={i} className="lowercase [font-variant-caps:small-caps]">{part}</span>
            ) : (
              part
            )
          )}
        </p>
        <p>
          {address?.split(/(\b[A-Z]{2,}\b)/).map((part, i) =>
            /^[A-Z]{2,}$/.test(part) ? (
              <span key={i} className="lowercase [font-variant-caps:small-caps]">{part}</span>
            ) : (
              part
            )
          )}
        </p>
      </div>
      </div>
    </section>
  );
}

interface ContactInfoProps {
  email: string | null;
  telephone: string | null;
  companyName?: string;
  address?: string;
}

export function ContactInfo({
  email,
  telephone,
  companyName = "Grgurević & Partners ltd.",
  address = "Čanićeva 6, Zagreb, hr-10000",
}: ContactInfoProps) {
  return (
    <section
      className="
        relative bg-white
        border-t border-b border-[var(--divider)]
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
          text-[var(--text-primary)]
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
          text-[var(--text-primary)]
        "
      >
        <p>{companyName}</p>
        <p>{address}</p>
      </div>
    </section>
  );
}

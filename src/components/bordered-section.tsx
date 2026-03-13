import type { ReactNode } from "react";

interface BorderedSectionProps {
  border: string;
  className?: string;
  children: ReactNode;
}

export function BorderedSection({
  border,
  className,
  children,
}: BorderedSectionProps) {
  return (
    <div className={border}>
      <div className={`content-wrapper ${className ?? ""}`}>{children}</div>
    </div>
  );
}

import { DataDump, type DataDumpProps } from "@/components/data-dump";

interface RawDataAccordionProps extends DataDumpProps {
  summary?: string;
}

export function RawDataAccordion({
  summary = "Raw data",
  ...dataDumpProps
}: RawDataAccordionProps) {
  return (
    <details className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-600">
        {summary}
      </summary>
      <div className="border-t border-zinc-200 p-4">
        <DataDump {...dataDumpProps} variant="plain" />
      </div>
    </details>
  );
}

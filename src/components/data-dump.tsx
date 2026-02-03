interface DataDumpProps {
  title: string;
  description?: string;
  data: unknown;
}

export function DataDump({ title, description, data }: DataDumpProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        {description ? (
          <p className="text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
      <pre className="overflow-x-auto rounded bg-zinc-950 p-4 text-xs text-zinc-100">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}

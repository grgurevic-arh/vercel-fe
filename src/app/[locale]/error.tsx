"use client";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[family-name:var(--font-untitled-serif)] text-4xl font-bold">
        Something went wrong
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        An unexpected error occurred.
      </p>
      <button
        onClick={reset}
        className="mt-8 text-sm underline underline-offset-4 hover:text-neutral-600"
      >
        Try again
      </button>
    </main>
  );
}

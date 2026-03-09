import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[family-name:var(--font-untitled-serif)] text-4xl font-bold">
        404
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm underline underline-offset-4 hover:text-neutral-600"
      >
        Go to homepage
      </Link>
    </main>
  );
}

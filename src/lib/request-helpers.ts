import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";

type ParamSource<T> = T | Promise<T>;

type ParamsWithLocale = { locale?: string };
type OptionalSearchParams =
  | Record<string, string | string[] | undefined>
  | undefined;

type SearchParamsSource =
  | OptionalSearchParams
  | Promise<OptionalSearchParams | undefined>;

const parsePositiveInteger = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
};

export async function resolveLocaleParam(
  paramsOrPromise: ParamSource<ParamsWithLocale>,
): Promise<Locale> {
  const params = await paramsOrPromise;
  const locale = params?.locale;

  if (!locale || !isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function resolvePageParam(
  searchParamsOrPromise?: SearchParamsSource,
  defaultPage = 1,
): Promise<number> {
  const searchParams = (await searchParamsOrPromise) ?? {};
  const rawPage = searchParams.page;
  const pageValue = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const parsed = parsePositiveInteger(pageValue ?? null);

  return parsed ?? defaultPage;
}

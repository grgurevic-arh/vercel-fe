const mediaFieldNames = [
  "url",
  "alternativeText",
  "caption",
  "width",
  "height",
] as const;

export function buildPopulateKey(segments: string[]): string {
  return segments.reduce((acc, segment, index) => {
    const populateSuffix = index === 0 ? "" : "[populate]";
    return `${acc}${populateSuffix}[${segment}]`;
  }, "populate");
}

export function buildMediaPopulateParams(path: string | string[]) {
  const segments = Array.isArray(path) ? path : [path];
  const baseKey = buildPopulateKey(segments);
  return mediaFieldNames.reduce<Record<string, string>>(
    (params, fieldName, index) => {
      params[`${baseKey}[fields][${index}]`] = fieldName;
      return params;
    },
    {},
  );
}

export function buildCollectionPopulateParams(
  config: Record<string, string | string[]>,
): Record<string, string> {
  return Object.entries(config).reduce<Record<string, string>>(
    (acc, [key, path]) => {
      const segments = Array.isArray(path) ? path : [path];
      acc[buildPopulateKey([key, ...segments])] = "*";
      return acc;
    },
    {},
  );
}

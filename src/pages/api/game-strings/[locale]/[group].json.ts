import type { APIContext, GetStaticPaths, GetStaticPathsResult } from "astro";
import { gameStrings } from "../../../../i18n/gameStrings";
import locales from "../../../../i18n/locales.json";

export const getStaticPaths: GetStaticPaths = () => {
  const params: GetStaticPathsResult = [];

  for (const locale in locales.locales) {
    for (const group of locales.groups) {
      params.push({
        params: { locale, group },
      });
    }
  }

  return params;
};

export async function GET({
  params,
}: APIContext<never, { locale: keyof typeof locales.locales; group: string }>) {
  const strings = await gameStrings(params.locale, params.group);
  return Response.json(strings);
}

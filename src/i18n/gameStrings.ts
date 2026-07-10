import { game } from "../game/vfs";
import locales from "../i18n/locales.json";
import type { GameStrings } from "../types/gameStrings";

export async function gameStrings(locale: string, _groups: string | string[]) {
  const groups = typeof _groups === "string" ? [_groups] : _groups;

  const minecraftLocale =
    locales.locales[locale as keyof typeof locales.locales].minecraft;
  const strings = await game.json<GameStrings>(
    `client/assets/minecraft/lang/${minecraftLocale}.json`,
  );

  const filtered: GameStrings = {};

  for (const group of groups) {
    for (const key in strings) {
      if (!key.startsWith(group)) continue;

      const name = key.replace(`${group}.`, "");

      if (name.includes(".")) continue;

      filtered[name] = strings[key];
    }
  }

  return filtered;
}

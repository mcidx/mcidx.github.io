import { readdir } from "node:fs/promises";
import { assertSSR } from "../astro/assertSSR";
import { env } from "../astro/env";
import locales from "../i18n/locales.json";
import type { Components } from "../types/components";
import type { GameStrings } from "../types/gameStrings";
import { ComponentAccessor } from "./componentAccessor";
import { GameStringAccessor } from "./gameStringAccessor";

class GameVFS {
  constructor(private base: string) {}

  path(relative: string) {
    return `${this.base}/${relative}`;
  }

  dir(path: string) {
    return readdir(this.path(path));
  }

  file(path: string) {
    return Bun.file(this.path(path));
  }

  json<Type>(path: string) {
    return this.file(path).json() as Promise<Type>;
  }

  async components(id: string) {
    const components = await this.json<Components>(
      `report/generated/reports/minecraft/components/item/${id}.json`,
    );

    return new ComponentAccessor(components, id);
  }

  async strings(locale: string) {
    const minecraftLocale =
      locales.locales[locale as keyof typeof locales.locales].minecraft;
    const strings = await vfs.json<GameStrings>(
      `client/assets/minecraft/lang/${minecraftLocale}.json`,
    );

    return new GameStringAccessor(strings);
  }
}

assertSSR();

export const vfs = new GameVFS(env("GAME"));

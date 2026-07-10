import { sluggify } from "../astro/sluggify";
import { gameStrings } from "../i18n/gameStrings";
import locales from "../i18n/locales.json";
import { unqualify } from "../minecraft/unqualify";
import type { DiscriminatedSlugs } from "../types/discriminatedSlugs";
import { registry } from "./registries";

export const blockSlugs: DiscriminatedSlugs = [];

const blockRegistry = registry("minecraft:block");
const blockString = await gameStrings(locales.default, "block.minecraft");

for (const block of blockRegistry) {
  blockSlugs.push({ id: block, slug: sluggify(blockString(unqualify(block))) });
}

blockSlugs.sort((a, b) => a.slug.localeCompare(b.slug));

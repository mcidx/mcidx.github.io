import type { Tags } from "../types/tags";
import { vfs } from "./vfs";

const root = "client/data/minecraft/tags";
export const tagGroups = new Map<string, Map<string, Set<string>>>();

for (const group of await vfs.dir(root)) {
  const path = `${root}/${group}`;
  const items = await vfs.dir(path);
  const hasImmediateTags = items.some((item) => item.endsWith(".json"));
  const tagPaths = new Map<string, string>();

  async function collectTags(path: string, parent: string) {
    const items = await vfs.dir(path);

    for (const item of items) {
      if (item.endsWith(".json")) {
        const name = item.replace(".json", "");
        tagPaths.set(`${parent}${name}`, `${path}${item}`);
        continue;
      }

      await collectTags(`${path}${item}/`, `${parent}${item}/`);
    }
  }

  if (hasImmediateTags) {
    await collectTags(`${path}/`, "");
  } else {
    let hasDuplicateChildren = false;
    const children = new Set<string>();

    for (const item of items) {
      for (const subItem of await vfs.dir(`${path}/${item}`)) {
        const hasChild = children.has(subItem);
        children.add(subItem);
        hasDuplicateChildren ||= hasChild;
        if (hasChild) break;
      }
    }

    if (hasDuplicateChildren) {
      await collectTags(`${path}/`, "");
    } else {
      for (const item of items) {
        await collectTags(`${path}/${item}/`, "");
      }
    }
  }

  const tags = new Map<string, Set<string>>();

  for (const [tag, path] of tagPaths) {
    const { values: ids } = await vfs.json<Tags>(path);
    tags.set(`#minecraft:${tag}`, new Set(ids));
  }

  function flatten(tag: string) {
    let flattened = new Set<string>();

    for (const id of tags.get(tag)!) {
      if (!id.startsWith("#")) {
        flattened.add(id);
        continue;
      }

      flattened = flattened.union(flatten(id));
    }

    return flattened;
  }

  for (const [tag] of tags) {
    tags.set(tag, flatten(tag));
  }

  tagGroups.set(group, tags);
}

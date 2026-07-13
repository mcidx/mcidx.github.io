import { tagGroups } from "./tags";

export class TagAccessor {
  private tags: Map<string, Set<string>>;

  constructor(private group: string) {
    if (!tagGroups.has(group)) {
      throw new Error(`Tag group "${group}" does not exist`);
    }

    this.tags = tagGroups.get(group)!;
  }

  tag(name: string) {
    if (!this.tags.has(name)) {
      console.log(`Tag "${name}" does not exist in group "${this.group}"`);
    }

    return this.tags.get(name)!;
  }

  applied(id: string) {
    const applied = new Set<string>();

    for (const [tag, ids] of this.tags) {
      if (!ids.has(id)) continue;
      applied.add(tag);
    }

    return [...applied];
  }
}

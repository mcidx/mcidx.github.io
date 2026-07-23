import { camelCase, upperFirst } from "lodash-es";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { type LanguageName } from "quicktype-core";
import { unqualify } from "../game/unqualify";
import { vfs } from "../game/vfs";

const readRoot = "report/generated/reports/minecraft/components/item";
const writeRoot = "src/generated/components";
const targetLanguage: LanguageName = "typescript-zod";
const items = await vfs.dir(readRoot);

const observations = new Map<string, unknown[]>();

for (const item of items) {
  const name = item.replace(".json", "");
  const components = await vfs.components(name);

  for (const name in components.components) {
    const component = components.components[name];

    if (!observations.has(name)) {
      observations.set(name, []);
    }

    observations.get(name)!.push(component);
  }
}

await rm(writeRoot, { recursive: true });
await mkdir(writeRoot, { recursive: true });

let i = 0;
for (const [id, samples] of observations) {
  if (i++ === 3) break;

  const unqualified = unqualify(id);
  const name = upperFirst(camelCase(unqualified));

  const path = `${writeRoot}/${unqualified}.ts`;
  const schema = inferSchema(samples[0]);

  let content = "";

  content += 'import { z } from "zod";\n\n';
  content += `export const ${name} = `;
  content += schema;
  content += ";\n";

  content = await format(content, { parser: "typescript" });

  await writeFile(path, content);
}

function inferSchema(sample: unknown) {
  const type = typeof sample;

  if (type === "string") {
    return "z.string()";
  }

  if (type === "number") {
    return "z.number()";
  }

  if (type === "boolean") {
    return "z.boolean()";
  }

  if (type === "object") {
    if (sample === null) {
      return "z.null()";
    }

    if (Array.isArray(sample)) {
      let child = "z.never()";

      if (sample.length > 0) {
        child = inferSchema(sample[0]);
      }

      return `z.array(${child})`;
    }

    let draft = "";

    draft += "z.object({";

    for (const key in sample) {
      draft += `${key}:${inferSchema((sample as Record<string, unknown>)[key])},`;
    }

    draft += "})";

    return draft;
  }

  throw new Error(`Unhandled type ${type}`);
}

import { camelCase, upperFirst } from "lodash-es";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { format } from "prettier";
import { unqualify } from "../game/unqualify";
import { vfs } from "../game/vfs";

const readRoot = "report/generated/reports/minecraft/components/item";
const writeRoot = "src/generated/components";
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

let indexImports = "";
let indexEntries = "";

for (const [id, samples] of observations) {
  const unqualified = unqualify(id);
  const name = upperFirst(camelCase(unqualified));
  const path = `${writeRoot}/${unqualified}.ts`;
  const schema = inferSchema(samples);

  let content = "";

  content += 'import { z } from "zod";\n\n';
  content += `export const ${name} = `;
  content += schema;
  content += ";\n";

  content = await format(content, { parser: "typescript" });

  indexImports += `import { ${name} } from "./${unqualified}";\n`;
  indexEntries += `  "${id}": ${name},\n`;

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

function inferSchema(samples: unknown[]) {
  if (samples.length === 0) return "z.never()";

  let hasArray = false;

  let total = 0;
  const arrayElements: unknown[] = [];
  const objectProperties: Record<string, unknown[]> = {};

  const schemas = new Set<string>();

  for (const sample of samples) {
    switch (typeof sample) {
      case "string":
        schemas.add("z.string()");
        break;

      case "number":
        schemas.add("z.number()");
        break;

      case "boolean":
        schemas.add("z.boolean()");
        break;

      case "object":
        if (sample === null) {
          schemas.add("z.null()");
          break;
        }

        if (Array.isArray(sample)) {
          hasArray = true;
          arrayElements.push(...sample);
          break;
        }

        total++;

        for (const key in sample) {
          if (!objectProperties[key]) objectProperties[key] = [];
          objectProperties[key].push((sample as Record<string, unknown>)[key]);
        }

        break;

      default:
        throw new Error(`Unhandled type ${typeof sample}`);
    }
  }

  if (hasArray) {
    schemas.add(`z.array(${inferSchema(arrayElements)})`);
  }

  if (total > 0) {
    let draft = "z.object({";
    const keys = Object.keys(objectProperties).sort();

    for (const key of keys) {
      const values = objectProperties[key];
      const isOptional = values.length < total;
      const valueSchema = inferSchema(values);

      draft += `"${key}":`;
      draft += valueSchema;

      if (isOptional) draft += ".optional()";

      draft += ",";
    }

    draft += "})";

    schemas.add(draft);
  }

  const uniqueSchemas = Array.from(schemas);

  if (uniqueSchemas.length === 0) return "z.never()";
  if (uniqueSchemas.length === 1) return uniqueSchemas[0];

  return `z.union([${uniqueSchemas.join(", ")}])`;
}

let indexContent = "";

indexContent += `${indexImports}\n`;
indexContent += "export const componentSchemas = {\n";
indexContent += indexEntries;
indexContent += "};\n";

await writeFile(`${writeRoot}/index.ts`, indexContent);

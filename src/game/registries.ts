import { game } from "./vfs";

type Registries = Record<string, Registry>;

interface Registry {
  default?: string;
  entries: Record<string, Entry>;
  protocol_id: number;
}

interface Entry {
  protocol_id: number;
}

const registries = await game.json<Registries>(
  "report/generated/reports/registries.json",
);

export function registry(name: string) {
  return Object.keys(registries[name].entries);
}

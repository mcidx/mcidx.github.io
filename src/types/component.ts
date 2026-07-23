import type { z } from "zod";
import { componentSchemas } from "../generated/components";

export type ComponentName = keyof typeof componentSchemas;

export type ComponentsMap = {
  [K in ComponentName]: z.infer<(typeof componentSchemas)[K]>;
};

export interface Components {
  components: ComponentsMap;
}

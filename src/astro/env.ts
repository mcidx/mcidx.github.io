/**
 * `import.meta.env` is not a normal object during build time so we have to
 * access every secret explicitly here
 */
const requiredEnvs = {
  GAME: import.meta.env.GAME,
  VERSION_MANIFEST: import.meta.env.VERSION_MANIFEST,
};

export type WellKnownEnv = keyof typeof requiredEnvs;

for (const key in requiredEnvs) {
  if (requiredEnvs[key as WellKnownEnv] === undefined) {
    throw new Error(`Required env "${key}" is missing`);
  }
}

export function env(name: WellKnownEnv) {
  return requiredEnvs[name]!;
}

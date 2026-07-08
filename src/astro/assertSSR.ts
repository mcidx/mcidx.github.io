export function assertSSR() {
  if (import.meta.env.SSR) return;
  throw new Error(`Server code found running on client`);
}

import { assertSSR } from "../astro/assertSSR";
import { secret } from "../secrets/secret";

class GameVFS {
  constructor(private base: string) {}

  file(path: string) {
    return Bun.file(`${this.base}/${path}`);
  }

  json<Type>(path: string) {
    return this.file(path).json() as Promise<Type>;
  }
}

assertSSR();

export const game = new GameVFS(secret("GAME"));

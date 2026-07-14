import type { APIContext, GetStaticPaths } from "astro";
import { parse } from "node:path";
import { vfs } from "../../../../game/vfs";

const paths = [
  "client/assets/minecraft/textures/gui/sprites/hud/food_full.png",
  "client/assets/minecraft/textures/gui/sprites/hud/food_half.png",
  "client/assets/minecraft/textures/gui/sprites/hud/food_empty.png",
];

export const getStaticPaths = (() => {
  return paths.map((path) => {
    const { name } = parse(path);
    return { params: { name }, props: { path } };
  });
}) satisfies GetStaticPaths;

export async function GET({ props }: APIContext<{ path: string }>) {
  const bytes = await vfs.bytes(props.path);
  return new Response(bytes);
}

import { $, argv } from "bun";
import { mkdir, rm } from "node:fs/promises";
import { exit } from "node:process";
import { env } from "../astro/env";
import { VersionType, type VersionManifest } from "../types/versionManifest";
import type { VersionPackage } from "../types/versionPackage";

const type = argv[2] as VersionType;

if (!Object.values(VersionType).includes(type)) {
  let message = `Invalid argument "${type}"; valid values:\n`;

  for (const value of Object.values(VersionType)) {
    message += `  ${value}\n`;
  }

  console.error(message);
  exit(1);
}

await rm(env("GAME"), { recursive: true, force: true });

const versionManifest = await fetch(env("VERSION_MANIFEST")).then(
  (response) => response.json() as Promise<VersionManifest>,
);
const version = versionManifest.versions.find(
  (version) => version.type === type,
);

if (version === undefined) {
  console.error(`No version found for type "${type}"`);
  exit(1);
}

const versionPackage = await fetch(version.url).then(
  (response) => response.json() as Promise<VersionPackage>,
);

await mkdir(`${env("GAME")}/client`, { recursive: true });
await mkdir(`${env("GAME")}/report`);

await $`curl -L ${versionPackage.downloads.client.url} | bsdtar -xf - -C ${env("GAME")}/client`;
await $`curl -L ${versionPackage.downloads.server.url} -o ${env("GAME")}/server.jar`;
await $`cd ${env("GAME")}/report && java -DbundlerMainClass=net.minecraft.data.Main -jar ../server.jar --reports`;

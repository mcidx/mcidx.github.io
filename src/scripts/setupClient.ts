import { $ } from "bun";
import { rm } from "node:fs/promises";
import { secret } from "../secrets/secret";
import { argv } from "bun";
import { VersionType, type VersionManifest } from "../types/versionManifest";
import { exit } from "node:process";
import type { VersionPackage } from "../types/versionPackage";
import { mkdir } from "node:fs/promises";

const type = argv[2] as VersionType;

if (!Object.values(VersionType).includes(type)) {
  let message = `Invalid argument "${type}"; valid values:\n`;

  for (const value of Object.values(VersionType)) {
    message += `  ${value}\n`;
  }

  console.error(message);
  exit(1);
}

await rm(secret("CLIENT"), { recursive: true, force: true });

const versionManifest = await fetch(secret("VERSION_MANIFEST")).then(
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

await mkdir(secret("CLIENT"), { recursive: true });

await $`curl -L ${versionPackage.downloads.client.url} | bsdtar -xf - -C ${secret("CLIENT")}`;

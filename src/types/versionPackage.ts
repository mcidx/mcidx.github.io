export interface VersionPackage {
  arguments: Record<string, Argument[]>;
  assetIndex: AssetIndex;
  assets: string;
  complianceLevel: number;
  downloads: Downloads;
  id: string;
  javaVersion: JavaVersion;
  libraries: Library[];
  logging: Record<string, Logging>;
  mainClass: string;
  minimumLauncherVersion: number;
  releaseTime: string;
  time: string;
  type: string;
}

type Argument =
  | {
      value: string[] | string;
      rules?: Rule[];
    }
  | string;

interface Rule {
  action: "allow";
  os?: OS;
  features?: Features;
}

interface OS {
  name?: string;
  arch?: string;
  versionRange?: VersionRange;
}

interface VersionRange {
  min?: string;
  max?: string;
}

interface Features {
  is_demo_user?: boolean;
  has_custom_resolution?: boolean;
  has_quick_plays_support?: boolean;
  is_quick_play_singleplayer?: boolean;
  is_quick_play_multiplayer?: boolean;
  is_quick_play_realms?: boolean;
}

interface AssetIndex {
  id: string;
  sha1: string;
  size: number;
  totalSize?: number;
  url: string;
}

interface Downloads {
  client: Download;
  server: Download;
}

interface Download {
  sha1: string;
  size: number;
  url: string;
  path?: string;
}

interface JavaVersion {
  component: string;
  majorVersion: number;
}

interface Library {
  downloads: { artifact: Download };
  name: string;
  rules?: Rule[];
}

interface Logging {
  argument: string;
  file: AssetIndex;
  type: string;
}

export interface VersionManifest {
  latest: LatestVersion;
  versions: Version[];
}

export interface LatestVersion {
  release: string;
  snapshot: string;
}

export interface Version {
  id: string;
  type: VersionType;
  url: string;
  time: string;
  releaseTime: string;
  sha1: string;
  complianceLevel: number;
}

export enum VersionType {
  Release = "release",
  Snapshot = "snapshot",
  OldBeta = "old_beta",
  OldAlpha = "old_alpha",
}

import { deburr } from "lodash-es";

const nonAlphanumericRegex = /[^a-z0-9]/g;
const multipleDashesRegex = /--+/g;
const trailingDashRegex = /-$/g;
const leadingDashRegex = /^-/g;

export function sluggify(value: string) {
  return deburr(value)
    .toLowerCase()
    .replaceAll(nonAlphanumericRegex, "-")
    .replaceAll(multipleDashesRegex, "-")
    .replaceAll(trailingDashRegex, "")
    .replaceAll(leadingDashRegex, "");
}

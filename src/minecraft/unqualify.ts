export function unqualify(key: string) {
  const [, name] = key.split(":");
  return name;
}

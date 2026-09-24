export type DeviceSearchItem = {
  category: "smartphone" | "camera";
  slug: string;
  name: string;
  brand: string;
  releaseDate: string;
  aliases: readonly string[];
};

/**
 * Reads the device identifiers out of the current pathname without looking
 * them up anywhere. `null` means "no comparison segment — use the caller's
 * default devices"; `[]` means the segment is malformed (too many `-vs-`
 * parts, or an empty part); otherwise it's 1-3 raw identifiers (slug, name,
 * alias, or model number) that still need server-side resolution.
 */
export function parseIdentifiersFromPathname(pathname: string): string[] | null {
  if (pathname === "/" || pathname === "/test/ui/glass") {
    return null;
  }

  const segment = pathname.split("/").filter(Boolean).at(-1);

  if (!segment) {
    return null;
  }

  const identifiers = segment.split(/-vs-/i);

  if (
    identifiers.length > 3 ||
    identifiers.some((identifier) => identifier.length === 0)
  ) {
    return [];
  }

  return identifiers;
}

export function buildComparisonPath(
  selectedDevices: DeviceSearchItem[],
  device: DeviceSearchItem,
): string | null {
  if (selectedDevices.some((selected) => selected.slug === device.slug)) {
    return null;
  }

  if (
    selectedDevices.length > 0 &&
    selectedDevices[0].category !== device.category
  ) {
    return `/${device.slug}`;
  }

  const selectedDeviceSlugs = selectedDevices.map((selected) => selected.slug);

  const nextDeviceSlugs =
    selectedDeviceSlugs.length >= 3
      ? [...selectedDeviceSlugs.slice(0, 2), device.slug]
      : [...selectedDeviceSlugs, device.slug];

  return `/${nextDeviceSlugs.join("-vs-")}`;
}

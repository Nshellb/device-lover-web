"use client";

import { useEffect, useState } from "react";

import { parseIdentifiersFromPathname, type DeviceSearchItem } from "@/lib/device-search";
import type { ApiCameraComparisonResponse, ApiComparisonResponse } from "@/lib/api/types";

/**
 * Resolves the devices selected by the current URL (the `/a-vs-b` segment),
 * via the same-origin comparison Route Handler — the browser can't call the
 * Rust API directly (no CORS layer there by design; see
 * device-lover-api/docs/catalog-design.md section 5). On "/" (and the glass
 * test page) it returns `defaultDevices` as-is with no network call.
 */
export function useSelectedDevices(
  pathname: string,
  defaultDevices: DeviceSearchItem[],
): DeviceSearchItem[] {
  const identifiers = parseIdentifiersFromPathname(pathname);
  const identifiersKey = identifiers?.join("|") ?? "";
  const [resolved, setResolved] = useState<{
    key: string;
    devices: DeviceSearchItem[];
  }>({ key: "", devices: [] });

  useEffect(() => {
    if (!identifiers || identifiers.length === 0) return;

    const controller = new AbortController();

    async function resolve(currentIdentifiers: string[]) {
      try {
        const params = new URLSearchParams();
        for (const identifier of currentIdentifiers) {
          params.append("identifiers", identifier);
        }

        const response = await fetch(`/api/comparisons?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setResolved({ key: identifiersKey, devices: [] });
          return;
        }

        const data = (await response.json()) as
          | ApiComparisonResponse
          | ApiCameraComparisonResponse;

        setResolved({
          key: identifiersKey,
          devices: data.devices.map((device) =>
            "releaseMonth" in device
              ? {
                  category: "camera" as const,
                  slug: device.slug,
                  name: device.name,
                  brand: device.brand,
                  releaseDate: `${device.releaseMonth}-01`,
                  aliases: [],
                }
              : {
                  category: "smartphone" as const,
                  slug: device.slug,
                  name: device.name,
                  brand: device.brand,
                  releaseDate: device.releaseDate,
                  aliases: device.aliases,
                },
          ),
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setResolved({ key: identifiersKey, devices: [] });
      }
    }

    void resolve(identifiers);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifiersKey]);

  if (!identifiers) return defaultDevices;
  if (identifiers.length === 0) return [];

  return resolved.key === identifiersKey ? resolved.devices : [];
}

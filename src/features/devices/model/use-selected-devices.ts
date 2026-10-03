"use client";

import { useEffect, useState } from "react";

import { resolveSelectedDevices } from "../api/client";
import { parseIdentifiersFromPathname } from "./comparison-path";
import type { DeviceSearchItem } from "./device";

/** Resolve URL selections once in the header and share them with its controls. */
export function useSelectedDevices(
  pathname: string,
  defaultDevices: DeviceSearchItem[],
): DeviceSearchItem[] {
  const identifiers = parseIdentifiersFromPathname(pathname);
  const identifiersKey = JSON.stringify(identifiers);
  const [resolved, setResolved] = useState<{
    key: string;
    devices: DeviceSearchItem[];
  }>({ key: "", devices: [] });

  useEffect(() => {
    const currentIdentifiers = JSON.parse(identifiersKey) as string[] | null;
    if (!currentIdentifiers?.length) return;

    const controller = new AbortController();

    resolveSelectedDevices(currentIdentifiers, controller.signal)
      .then((devices) => setResolved({ key: identifiersKey, devices }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setResolved({ key: identifiersKey, devices: [] });
      });

    return () => controller.abort();
  }, [identifiersKey]);

  if (!identifiers) return defaultDevices;
  if (identifiers.length === 0) return [];

  return resolved.key === identifiersKey ? resolved.devices : [];
}

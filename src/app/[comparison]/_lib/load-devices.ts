import "server-only";

import { notFound } from "next/navigation";

import { toCamera, toDevice } from "@/features/devices/api/adapters";
import { parseComparisonIdentifiers } from "@/features/devices/model/comparison-path";
import { getResolvedComparison } from "@/server/devices/api";

export async function loadDevices(comparison: string) {
  const identifiers = parseComparisonIdentifiers(comparison);
  if (!identifiers) notFound();

  // The backend resolves slugs, display names, aliases, and model numbers.
  const response = await getResolvedComparison(identifiers);
  if (!response) notFound();

  return response.devices.map((device) =>
    "releaseMonth" in device ? toCamera(device) : toDevice(device),
  );
}

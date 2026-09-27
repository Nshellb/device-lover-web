import type { DeviceSearchItem } from "../model/device";
import { toDeviceSearchItem } from "./adapters";
import type {
  ApiCameraComparisonResponse,
  ApiComparisonResponse,
  ApiDeviceListResponse,
  ApiDeviceSelectionRequest,
} from "./types";

// Browser requests use the same-origin handlers; the backend has no CORS layer.
export async function searchDevices(
  query: string,
  signal: AbortSignal,
): Promise<DeviceSearchItem[]> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);

  const response = await fetch(`/api/devices?${params.toString()}`, { signal });
  if (!response.ok) throw new Error("Device search failed");

  const data = (await response.json()) as ApiDeviceListResponse;
  return data.items.map(toDeviceSearchItem);
}

export async function resolveSelectedDevices(
  identifiers: string[],
  signal: AbortSignal,
): Promise<DeviceSearchItem[]> {
  const params = new URLSearchParams();
  for (const identifier of identifiers) params.append("identifiers", identifier);

  const response = await fetch(`/api/comparisons?${params.toString()}`, { signal });
  if (!response.ok) return [];

  const data = (await response.json()) as
    | ApiComparisonResponse
    | ApiCameraComparisonResponse;

  return data.devices.map((device) =>
    "releaseMonth" in device
      ? {
          category: "camera",
          slug: device.slug,
          name: device.name,
          brand: device.brand,
          releaseDate: `${device.releaseMonth}-01`,
          aliases: [],
        }
      : toDeviceSearchItem(device),
  );
}

export function recordDeviceSelection(input: ApiDeviceSelectionRequest): void {
  void fetch("/api/device-selections", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    keepalive: true,
  }).catch(() => {
    // Analytics must never delay navigation.
  });
}

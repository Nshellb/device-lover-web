import type {
  ApiCameraComparisonResponse,
  ApiCameraListResponse,
  ApiComparisonResponse,
  ApiDeviceDetail,
  ApiDeviceListResponse,
  ApiDeviceSelectionRequest,
  ApiErrorEnvelope,
  ApiHomeResponse,
  ApiPopularDevicesResponse,
  ApiRouteMissCreateRequest,
} from "@/lib/api/types";

// Server-only: this calls the Rust API directly (device-lover-api has no CORS
// layer), so it must only run in Server Components, Server Actions, or Route
// Handlers. Client components go through the Next Route Handlers under
// app/api/* instead. See device-lover-api/docs/catalog-design.md section 5.
const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:4040";
const REVALIDATE_SECONDS = 60;

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

function buildUrl(path: string, params?: Record<string, string | string[] | undefined>): URL {
  const url = new URL(path, API_BASE_URL);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, item);
    } else {
      url.searchParams.set(key, value);
    }
  }

  return url;
}

async function apiFetch<T>(
  path: string,
  params?: Record<string, string | string[] | undefined>,
): Promise<T> {
  const url = buildUrl(path, params);
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    let code = "unknown_error";
    let message = `API request to ${path} failed with status ${response.status}`;

    try {
      const body = (await response.json()) as ApiErrorEnvelope;
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // Non-JSON error body (e.g. 408 timeout) — keep the default message.
    }

    throw new ApiRequestError(response.status, code, message);
  }

  return response.json() as Promise<T>;
}

export type ListDevicesParams = {
  q?: string;
  brand?: string;
  page?: number;
  pageSize?: number;
  sort?: "relevance" | "release_date_desc";
};

export async function listDevices(
  params: ListDevicesParams = {},
): Promise<ApiDeviceListResponse> {
  return apiFetch<ApiDeviceListResponse>("/api/v1/devices", {
    q: params.q,
    brand: params.brand,
    page: params.page?.toString(),
    page_size: params.pageSize?.toString(),
    sort: params.sort,
  });
}

export async function listCameras(
  params: { q?: string; page?: number; pageSize?: number } = {},
): Promise<ApiCameraListResponse> {
  return apiFetch<ApiCameraListResponse>("/api/v1/cameras", {
    q: params.q,
    page: params.page?.toString(),
    page_size: params.pageSize?.toString(),
  });
}

export async function getDeviceByIdentifier(
  identifier: string,
): Promise<ApiDeviceDetail | null> {
  try {
    return await apiFetch<ApiDeviceDetail>(
      `/api/v1/devices/${encodeURIComponent(identifier)}`,
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function getComparison(
  identifiers: string[],
): Promise<ApiComparisonResponse | null> {
  try {
    return await apiFetch<ApiComparisonResponse>("/api/v1/comparisons", {
      identifiers,
    });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function getCameraComparison(
  identifiers: string[],
): Promise<ApiCameraComparisonResponse | null> {
  try {
    return await apiFetch<ApiCameraComparisonResponse>(
      "/api/v1/cameras/comparisons",
      { identifiers },
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function getHome(): Promise<ApiHomeResponse> {
  return apiFetch<ApiHomeResponse>("/api/v1/home");
}

export async function getPopularDevices(): Promise<ApiPopularDevicesResponse> {
  return apiFetch<ApiPopularDevicesResponse>("/api/v1/popular-devices");
}

export async function recordDeviceSelection(input: ApiDeviceSelectionRequest): Promise<void> {
  const response = await fetch(buildUrl("/api/v1/device-selections"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      "device_selection_recording_failed",
      "Device selection recording failed",
    );
  }
}

export async function recordRouteMiss(input: ApiRouteMissCreateRequest): Promise<void> {
  const response = await fetch(buildUrl("/api/v1/route-misses"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      "route_miss_recording_failed",
      "Route miss recording failed",
    );
  }
}

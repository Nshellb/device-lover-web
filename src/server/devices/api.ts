import "server-only";

import type {
  ApiCameraComparisonResponse,
  ApiCameraListResponse,
  ApiComparisonResponse,
  ApiDeviceDetail,
  ApiDeviceListResponse,
  ApiDeviceSelectionRequest,
  ApiHomeResponse,
  ApiPopularDevicesResponse,
} from "@/features/devices/api/types";
import { ApiRequestError, apiFetch, apiPost } from "@/server/api/client";

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

export async function getResolvedComparison(
  identifiers: string[],
): Promise<ApiComparisonResponse | ApiCameraComparisonResponse | null> {
  const smartphones = await getComparison(identifiers);
  return smartphones ?? getCameraComparison(identifiers);
}

export async function getHome(): Promise<ApiHomeResponse> {
  return apiFetch<ApiHomeResponse>("/api/v1/home");
}

export async function getPopularDevices(): Promise<ApiPopularDevicesResponse> {
  return apiFetch<ApiPopularDevicesResponse>("/api/v1/popular-devices");
}

export async function recordDeviceSelection(input: ApiDeviceSelectionRequest): Promise<void> {
  await apiPost("/api/v1/device-selections", input, {
    code: "device_selection_recording_failed",
    message: "Device selection recording failed",
  });
}

import "server-only";

import type { ApiDeviceListResponse } from "@/features/devices/api/types";
import { getPopularDevices, listCameras, listDevices } from "./api";

export async function searchDevices(searchParams: URLSearchParams): Promise<ApiDeviceListResponse> {
  const page = searchParams.get("page");
  const pageSize = searchParams.get("page_size");
  const sort = searchParams.get("sort");
  const query = searchParams.get("q") ?? undefined;
  const requestedPageSize = pageSize ? Number(pageSize) : 30;

  if (!query && !page && !pageSize && !sort && !searchParams.has("brand")) {
    const popular = await getPopularDevices();
    return {
      items: popular.items,
      pagination: {
        page: 1,
        pageSize: popular.items.length,
        total: popular.items.length,
        totalPages: popular.items.length === 0 ? 0 : 1,
      },
    };
  }

  const [smartphones, cameras] = await Promise.all([
    listDevices({
      q: query,
      brand: searchParams.get("brand") ?? undefined,
      page: page ? Number(page) : undefined,
      pageSize: requestedPageSize,
      sort: sort === "relevance" || sort === "release_date_desc" ? sort : undefined,
    }),
    listCameras({ q: query, page: page ? Number(page) : undefined, pageSize: requestedPageSize }),
  ]);
  const cameraItems = cameras.items.map((camera) => ({
    id: camera.id,
    slug: camera.slug,
    category: "camera",
    brand: camera.brand,
    brandSlug: camera.brandSlug,
    name: camera.name,
    releaseDate: `${camera.releaseMonth}-01`,
    marketCode: "JP",
    aliases: [] as string[],
    modelNumbers: [] as string[],
    imageUrl: null,
  }));
  // With a query the API already ranks each list by relevance (name matches first),
  // and the two lists can't be merged by relevance here, so keep that order instead
  // of re-sorting by release date: smartphones first, then cameras.
  const byRelevance = Boolean(query) && sort !== "release_date_desc";
  const merged = [...smartphones.items, ...cameraItems];
  const items = (
    byRelevance
      ? merged
      : merged.sort((left, right) => right.releaseDate.localeCompare(left.releaseDate))
  ).slice(0, requestedPageSize);
  const total = smartphones.pagination.total + cameras.pagination.total;

  return {
    items,
    pagination: {
      page: 1,
      pageSize: requestedPageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / requestedPageSize),
    },
  };
}

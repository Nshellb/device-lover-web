import "server-only";

import { apiPost } from "@/server/api/client";

export type ApiRouteMissCreateRequest = {
  requestedPath: string;
  referrer: string | null;
  locale: string | null;
  viewportClass: "mobile" | "tablet" | "desktop";
};

export async function recordRouteMiss(input: ApiRouteMissCreateRequest): Promise<void> {
  await apiPost("/api/v1/route-misses", input, {
    code: "route_miss_recording_failed",
    message: "Route miss recording failed",
  });
}

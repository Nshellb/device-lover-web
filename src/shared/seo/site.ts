export const SITE_NAME = "Device Lover";
export const SITE_DESCRIPTION =
  "스마트폰과 카메라 등 전자기기의 사양을 한눈에 비교하세요.";

// Public origin used for canonical/OG absolute URLs. Set NEXT_PUBLIC_SITE_URL
// in production; the fallback only keeps local builds working.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

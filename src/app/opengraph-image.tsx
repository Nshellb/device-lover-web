import { brandImageSize, renderBrandImage } from "@/shared/seo/brand-image";
import { SITE_DESCRIPTION } from "@/shared/seo/site";

export const alt = "Device Lover - 전자기기 사양 비교";
export const size = brandImageSize;
export const contentType = "image/png";

export default function Image() {
  return renderBrandImage("전자기기 사양을 한눈에 비교", SITE_DESCRIPTION);
}

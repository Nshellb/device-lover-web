import type { Device, DeviceSearchItem, SpecKey, SpecValue } from "@/features/devices/model/device";
import type { ApiCamera, ApiDeviceDetail, ApiDeviceSummary, ApiSpecValue } from "./types";

// Matches device-lover-api's src/catalog.rs SPEC_KEYS exactly — every
// DeviceDetail response always carries all 27 of these keys.
const SPEC_KEYS: SpecKey[] = [
  "operatingSystem",
  "colors",
  "dimensions",
  "weight",
  "storage",
  "stylus",
  "displayPanel",
  "displaySize",
  "displayResolution",
  "refreshRate",
  "displayFeatures",
  "processor",
  "memory",
  "wiredConnection",
  "speakers",
  "rearCameras",
  "telephoto",
  "digitalZoom",
  "frontCamera",
  "videoRecording",
  "batteryCapacity",
  "videoPlayback",
  "fastCharging",
  "wirelessCharging",
  "wireless",
  "biometrics",
  "waterResistance",
];

export function brandVisual(brandSlug: string): Device["visual"] {
  return brandSlug === "apple" ? "iphone" : "galaxy";
}

function toSpecValue(spec: ApiSpecValue | undefined): SpecValue {
  if (!spec) return { value: "정보 없음", muted: true };

  return {
    value: spec.value,
    detail: spec.detail ?? undefined,
    muted: spec.muted,
  };
}

export function toCamera(camera: ApiCamera): Device {
  return {
    category: "camera",
    slug: camera.slug,
    aliases: [],
    brand: camera.brand,
    name: camera.name,
    releaseDate: `${camera.releaseMonth}-01`,
    variant: camera.series,
    visual: "camera",
    imageUrl: null,
    sourceUrl: camera.sourceUrl,
    specs: {
      cameraType: { value: camera.cameraType },
      series: { value: camera.series },
      sensorFormat: {
        value: camera.sensorFormat === "full_frame" ? "풀프레임" : "APS-C",
      },
      effectiveMegapixels: { value: `${camera.effectiveMegapixels} MP` },
      imageProcessor: { value: camera.imageProcessor },
      lensMount: { value: camera.lensMount },
      maxContinuousFps: {
        value: `${camera.maxContinuousFps} fps`,
        detail: camera.continuousShootingNote ?? undefined,
      },
      videoSpec: {
        value: camera.videoSpec,
        muted: camera.videoSpec === "미지원",
      },
      bodyWeight: {
        value: `${camera.bodyWeightG} g`,
        detail: "배터리·메모리 카드 제외",
      },
    },
  };
}

export function toDevice(detail: ApiDeviceDetail): Device {
  const specs = Object.fromEntries(
    SPEC_KEYS.map((key) => [key, toSpecValue(detail.specs[key])]),
  ) as Record<SpecKey, SpecValue>;

  return {
    category: "smartphone",
    slug: detail.slug,
    aliases: detail.aliases,
    brand: detail.brand,
    name: detail.name,
    releaseDate: detail.releaseDate,
    variant: detail.variant ?? "",
    visual: brandVisual(detail.brandSlug),
    imageUrl: detail.imageUrl,
    sourceUrl: detail.sourceUrl,
    specs,
  };
}

export function toDeviceSearchItem(summary: ApiDeviceSummary): DeviceSearchItem {
  return {
    category: summary.category === "camera" ? "camera" : "smartphone",
    slug: summary.slug,
    name: summary.name,
    brand: summary.brand,
    releaseDate: summary.releaseDate,
    aliases: summary.aliases,
  };
}

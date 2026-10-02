import type {
  Device,
  DeviceSearchItem,
  SpecKey,
  SpecValue,
} from "@/features/devices/model/device";
import { subDisplayKeys } from "@/features/devices/model/specification-sections";
import type {
  ApiCamera,
  ApiDeviceDetail,
  ApiDeviceSummary,
  ApiDimension,
  ApiSpecValue,
} from "./types";

// Matches device-lover-api's src/catalog.rs SPEC_KEYS exactly — every
// DeviceDetail response always carries all 25 of these keys. Colors are a
// separate `colors` field on the response, not one of these generic specs.
const SPEC_KEYS: SpecKey[] = [
  "operatingSystem",
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
  if (brandSlug === "apple") return "iphone";
  if (brandSlug === "samsung") return "galaxy";
  return "other";
}

function toSpecValue(spec: ApiSpecValue | undefined): SpecValue {
  if (!spec) return { value: "정보 없음" };

  return {
    value: spec.value,
    detail: spec.detail ?? undefined,
  };
}

export function toCamera(camera: ApiCamera): Device {
  return {
    category: "camera",
    slug: camera.slug,
    aliases: [],
    modelNumbers: [],
    brand: camera.brand,
    name: camera.name,
    releaseDate: `${camera.releaseMonth}-01`,
    variant: camera.series,
    visual: "camera",
    imageUrl: null,
    colors: [],
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
      },
      bodyWeight: {
        value: `${camera.bodyWeightG} g`,
        detail: "배터리·메모리 카드 제외",
      },
    },
  };
}

// The API returns up to 3 structured dimension entries (e.g. 펼친 상태 / 접은 상태).
// One entry reads as plain "a × b × c mm"; several are shown as labelled blocks.
function toDimensionsSpec(dimensions: ApiDimension[]): SpecValue {
  const format = (dimension: ApiDimension) =>
    `${dimension.widthMm} × ${dimension.heightMm} × ${dimension.depthMm} mm`;
  if (dimensions.length === 0) return { value: "정보 없음" };
  if (dimensions.length === 1) {
    return {
      value: format(dimensions[0]),
      detail: dimensions[0].note ?? undefined,
    };
  }

  return {
    value: format(dimensions[0]),
    blocks: dimensions.map((dimension) => ({
      label: dimension.label,
      value: format(dimension),
      detail: dimension.note ?? undefined,
    })),
  };
}

export function toDevice(detail: ApiDeviceDetail): Device {
  const specs = Object.fromEntries([
    ["dimensions", toDimensionsSpec(detail.dimensions)] as const,
    ...SPEC_KEYS.map((key) => [key, toSpecValue(detail.specs[key])] as const),
    // Sub displays exist only on foldables; include them only when present.
    ...[1, 2]
      .flatMap((sub) => subDisplayKeys(sub))
      .flatMap((key) =>
        detail.specs[key]
          ? [[key, toSpecValue(detail.specs[key])] as const]
          : [],
      ),
  ]) as Record<SpecKey, SpecValue>;

  return {
    category: "smartphone",
    slug: detail.slug,
    aliases: detail.aliases,
    modelNumbers: detail.modelNumbers,
    brand: detail.brand,
    name: detail.name,
    releaseDate: detail.releaseDate,
    variant: detail.variant ?? "",
    visual: brandVisual(detail.brandSlug),
    imageUrl: detail.imageUrl,
    colors: detail.colors,
    sourceUrl: detail.sourceUrl,
    specs,
  };
}

export function toDeviceSearchItem(
  summary: ApiDeviceSummary,
): DeviceSearchItem {
  return {
    category: summary.category === "camera" ? "camera" : "smartphone",
    slug: summary.slug,
    name: summary.name,
    brand: summary.brand,
    releaseDate: summary.releaseDate,
    aliases: summary.aliases,
  };
}

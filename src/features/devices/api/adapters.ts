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
  ApiDeviceConfiguration,
  ApiDeviceSoftware,
  ApiDimension,
  ApiMaterial,
  ApiSpecValue,
} from "./types";

// Matches device-lover-api's src/catalog.rs SPEC_KEYS exactly — every
// DeviceDetail response always carries all 25 of these keys. Colors are a
// separate `colors` field on the response, not one of these generic specs.
const SPEC_KEYS: SpecKey[] = [
  "weight",
  "storage",
  "stylus",
  "displayPanel",
  "displaySize",
  "displayResolution",
  "refreshRate",
  "displayPeakBrightness",
  "displayLamination",
  "displayAntiReflective",
  "displayColorGamut",
  "displayContrastRatio",
  "displaySupplier",
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
  "videoPlayback",
  "wireless",
  "biometrics",
  "waterResistance",
  "sim",
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

// Basic info shows just "출시 버전 ~ 최신 버전" (the launch version alone when there
// are no upgrades); the 기타 section shows the full upgrade path with arrows.
function toSoftwareSummary(items: ApiDeviceSoftware[]): SpecValue {
  if (items.length === 0) return { value: "미확인" };
  const launch = items.find((item) => item.isLaunch) ?? items[0];
  const latest = items[items.length - 1];

  return {
    value:
      latest === launch ? launch.label : `${launch.label} ~ ${latest.label}`,
    detail: launch.note ?? undefined,
  };
}

function toSoftwareDetail(items: ApiDeviceSoftware[]): SpecValue {
  if (items.length === 0) return { value: "미확인" };
  const launch = items.find((item) => item.isLaunch) ?? items[0];

  return {
    value: items.map((item) => item.label).join(" → "),
    detail: launch.note ?? undefined,
  };
}

function chargeSpec(watts: number | null, note: string | null): SpecValue {
  const value =
    watts === null ? "미확인" : watts === 0 ? "미지원" : `${watts}W`;
  return { value, detail: note ?? undefined };
}

function toMaterialsSpec(materials: ApiMaterial[]): SpecValue {
  if (materials.length === 0) return { value: "미확인" };

  return {
    value: materials.map((item) => `${item.part} ${item.material}`).join(", "),
    blocks: materials.map((item) => ({
      label: item.part,
      value: item.material,
      detail: item.note ?? undefined,
    })),
  };
}

// Launch price per configuration (KRW, plus USD when known); one configuration
// reads as a plain price.
function toLaunchPriceSpec(
  configurations: ApiDeviceConfiguration[],
): SpecValue {
  const format = (item: ApiDeviceConfiguration) => {
    const parts = [
      item.priceKrw !== null
        ? `${item.priceKrw.toLocaleString("ko-KR")}원`
        : null,
      item.priceUsd !== null
        ? `$${item.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : null,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" / ") : "미확인";
  };
  if (
    configurations.every(
      (item) => item.priceKrw === null && item.priceUsd === null,
    )
  ) {
    return { value: "미확인" };
  }
  if (configurations.length === 1) return { value: format(configurations[0]) };

  return {
    value: format(configurations[0]),
    blocks: configurations.map((item) => ({
      label: item.label,
      value: format(item),
    })),
  };
}

export function toDevice(detail: ApiDeviceDetail): Device {
  const specs = Object.fromEntries([
    // `?? []`: a cached or older API response can predate the dimensions field.
    ["dimensions", toDimensionsSpec(detail.dimensions ?? [])] as const,
    [
      "operatingSystem",
      toSoftwareSummary(detail.software.filter((i) => i.category === "os")),
    ] as const,
    [
      "ux",
      toSoftwareSummary(detail.software.filter((i) => i.category === "ux")),
    ] as const,
    [
      "osDetail",
      toSoftwareDetail(detail.software.filter((i) => i.category === "os")),
    ] as const,
    [
      "uxDetail",
      toSoftwareDetail(detail.software.filter((i) => i.category === "ux")),
    ] as const,
    ["materials", toMaterialsSpec(detail.materials)] as const,
    ["launchPrice", toLaunchPriceSpec(detail.configurations)] as const,
    [
      "batteryCapacity",
      {
        value:
          detail.power.batteryMah === null
            ? "미확인"
            : `${detail.power.batteryMah.toLocaleString("ko-KR")}mAh`,
        detail: detail.power.batteryNote ?? undefined,
      },
    ] as const,
    [
      "fastCharging",
      chargeSpec(detail.power.wiredW, detail.power.wiredNote),
    ] as const,
    [
      "wirelessCharging",
      chargeSpec(detail.power.wirelessW, detail.power.wirelessNote),
    ] as const,
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
    imageAlt: detail.imageAlt,
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

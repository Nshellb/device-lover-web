import type { Device, SpecValue } from "./device";
import { subDisplayTitle } from "./specification-sections";

// The stylus row is hidden when none of the devices on screen support a pen.
// displayResolution keeps the PPI inside its free-text detail ("460ppi",
// "FHD+, 416ppi"). Splits it out so it can get its own row.
// A leading "약" belongs to the PPI and goes with it.
const PPI_PATTERN = /(?:약\s*)?(\d+(?:\.\d+)?)\s*ppi/i;

export function splitResolutionDetail(detail: string | undefined): {
  ppi?: string;
  rest?: string;
} {
  if (!detail) return {};
  const match = detail.match(PPI_PATTERN);
  if (!match) return { rest: detail };
  const rest = detail
    .replace(match[0], "")
    .replace(/^[\s,]+|[\s,]+$/g, "")
    .replace(/,\s*,/g, ",");
  return { ppi: `${match[1]}ppi`, rest: rest || undefined };
}

export function isSpecificationRowVisible(
  devices: readonly Device[],
  key: string,
): boolean {
  if (key === "stylus") {
    return devices.some((device) => device.specs.stylus?.value !== "미지원");
  }

  // Lamination / anti-reflective rows (main and sub displays) only appear when
  // at least one device on screen actually has the treatment.
  if (/^(sub\d)?[dD]isplay(Lamination|AntiReflective)$/.test(key)) {
    return devices.some((device) => device.specs[key]?.value === "있음");
  }

  // PPI rows appear once at least one device has a PPI.
  const ppiKey = key.match(/^(sub\d)?[dD]isplayPpi$/);
  if (ppiKey) {
    const resolutionKey = ppiKey[1]
      ? `${ppiKey[1]}DisplayResolution`
      : "displayResolution";
    return devices.some(
      (device) => splitResolutionDetail(device.specs[resolutionKey]?.detail).ppi,
    );
  }

  // Gamut / contrast / supplier / Always On Display rows are shown once at
  // least one device has a value.
  if (
    /^(sub\d)?[dD]isplay(ColorGamut|ContrastRatio|Supplier|AlwaysOn)$/.test(key)
  ) {
    return devices.some(
      (device) => device.specs[key] && device.specs[key].value !== "미확인",
    );
  }

  return true;
}

export function getSpecificationValue(
  device: Device,
  key: string,
  isBasicInformation: boolean,
): SpecValue {
  if (key === "releaseDate") {
    const [year, month, day] = device.releaseDate.split("-");

    return {
      value:
        device.category === "camera"
          ? `${year}년 ${Number(month)}월`
          : `${year}년 ${Number(month)}월 ${Number(day)}일`,
    };
  }

  // displaySize stores the ratio in its detail ("19.5:9 비율"); the 디스플레이
  // sections show it as its own 화면 비율 row, so 화면 크기 drops the detail.
  const sizeKey = key.match(/^(sub\d)?[dD]isplay(Size|AspectRatio)$/);
  if (sizeKey && !isBasicInformation) {
    const size = device.specs[
      sizeKey[1] ? `${sizeKey[1]}DisplaySize` : "displaySize"
    ] ?? { value: sizeKey[1] ? "-" : "정보 없음" };
    if (sizeKey[2] === "Size") return { value: size.value };
    return {
      value:
        size.detail?.match(/\d+(?:\.\d+)?\s*:\s*\d+(?:\.\d+)?/)?.[0] ??
        (sizeKey[1] ? "-" : "정보 없음"),
    };
  }

  // Same for displayResolution: the PPI in its detail gets its own PPI row.
  const resolutionKey = key.match(/^(sub\d)?[dD]isplay(Resolution|Ppi)$/);
  if (resolutionKey && !isBasicInformation) {
    const missing = resolutionKey[1] ? "-" : "정보 없음";
    const resolution = device.specs[
      resolutionKey[1] ? `${resolutionKey[1]}DisplayResolution` : "displayResolution"
    ];
    if (!resolution) return { value: missing };
    const { ppi, rest } = splitResolutionDetail(resolution.detail);
    if (resolutionKey[2] === "Resolution") {
      return { value: resolution.value, detail: rest };
    }
    return { value: ppi ?? "미확인" };
  }

  const value = device.specs[key] ?? {
    value: key.startsWith("sub") ? "-" : "정보 없음",
  };

  if (!isBasicInformation || device.category !== "smartphone") return value;

  // The 기본 정보 summary shows only the chip name; the detail stays in 성능.
  if (key === "processor") return { value: value.value };

  if (key === "memory") {
    return {
      value: `RAM ${value.value}`,
      detail: `내장메모리 ${device.specs.storage.value}${
        value.detail ? `, RAM ${value.detail}` : ""
      }`,
    };
  }

  if (key === "displaySize") {
    const resolution = device.specs.displayResolution.value;
    const stylus = device.specs.stylus.value;

    const mainDetail = [
      value.detail,
      resolution === "미확인" ? null : `${resolution} 픽셀`,
      stylus === "미지원" ? null : `펜 지원 (${stylus})`,
    ]
      .filter(Boolean)
      .join(", ");

    const subBlocks = [1, 2].flatMap((sub) => {
      const size = device.specs[`sub${sub}DisplaySize`];
      if (!size) return [];
      const resolution = device.specs[`sub${sub}DisplayResolution`]?.value;

      return [
        {
          label: subDisplayTitle(
            device.specs[`sub${sub}DisplayName`]?.value,
            sub,
          ),
          value: size.value,
          detail:
            [
              size.detail,
              resolution && resolution !== "미확인"
                ? `${resolution} 픽셀`
                : null,
            ]
              .filter(Boolean)
              .join(", ") || undefined,
        },
      ];
    });

    return {
      value: value.value,
      detail: mainDetail,
      blocks:
        subBlocks.length > 0
          ? [
              {
                label: "메인",
                value: value.value,
                detail: mainDetail || undefined,
              },
              ...subBlocks,
            ]
          : undefined,
    };
  }

  return value;
}

import type { Device, SpecValue } from "./device";
import { subDisplayTitle } from "./specification-sections";

// The stylus row is hidden when none of the devices on screen support a pen.
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

  // Gamut / contrast / supplier rows are shown once at least one device has a value.
  if (/^(sub\d)?[dD]isplay(ColorGamut|ContrastRatio|Supplier)$/.test(key)) {
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

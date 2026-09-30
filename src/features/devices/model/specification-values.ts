import type { Device, SpecValue } from "./device";

// The stylus row is hidden when none of the devices on screen support a pen.
export function isSpecificationRowVisible(
  devices: readonly Device[],
  key: string,
): boolean {
  if (key !== "stylus") return true;

  return devices.some((device) => device.specs.stylus?.value !== "미지원");
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

  const value = device.specs[key] ?? { value: "정보 없음" };

  if (!isBasicInformation || device.category !== "smartphone") return value;

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

    return {
      value: value.value,
      detail: [
        value.detail,
        resolution === "미확인" ? null : `${resolution} 픽셀`,
        stylus === "미지원" ? null : `펜 지원 (${stylus})`,
      ]
        .filter(Boolean)
        .join(", "),
    };
  }

  return value;
}

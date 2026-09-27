import type { Device, SpecValue } from "./device";

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

  const value = device.specs[key] ?? { value: "정보 없음", muted: true };

  if (!isBasicInformation || device.category !== "smartphone") return value;

  if (key === "memory") {
    return {
      value: `RAM ${value.value}`,
      detail: `내장메모리 ${device.specs.storage.value}${
        value.detail ? ` · RAM ${value.detail}` : ""
      }`,
      muted: value.muted,
    };
  }

  if (key === "displaySize") {
    const inches = value.detail?.match(/(\d+(?:\.\d+)?)형/)?.[1];
    const metricSize = value.value.match(/^(\d+(?:\.\d+)?)\s*(mm|cm)$/);
    const millimetres = metricSize
      ? `${
          metricSize[2] === "cm"
            ? Number(metricSize[1]) * 10
            : metricSize[1]
        }mm`
      : value.value;
    const resolution = device.specs.displayResolution.value;
    const pixels = resolution.match(/(\d+)\s*×\s*(\d+)/);
    const aspectRatio = pixels
      ? Math.round((Number(pixels[1]) / Number(pixels[2])) * 18) / 2
      : null;
    const stylus = device.specs.stylus.value;

    return {
      value: inches
        ? `${value.detail?.startsWith("약") ? "약 " : ""}${inches}인치 (${millimetres})`
        : value.value,
      detail: [
        aspectRatio ? `약 ${aspectRatio}:9 비율` : null,
        `${resolution} 픽셀`,
        stylus === "미지원" ? null : `펜 지원 (${stylus})`,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  }

  return value;
}

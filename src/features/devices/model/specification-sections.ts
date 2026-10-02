export const specificationSections = [
  {
    title: "기본 정보",
    description: "핵심 하드웨어와 기본 사양",
    rows: [
      { key: "processor", label: "프로세서 (AP)" },
      { key: "memory", label: "메모리" },
      { key: "displaySize", label: "디스플레이" },
      { key: "dimensions", label: "크기" },
      { key: "weight", label: "무게" },
      { key: "rearCameras", label: "카메라" },
      { key: "wiredConnection", label: "단자" },
      { key: "biometrics", label: "생체인식" },
      { key: "waterResistance", label: "방수방진" },
      { key: "speakers", label: "스피커" },
      { key: "stylus", label: "펜 지원" },
      { key: "operatingSystem", label: "운영체제" },
      { key: "releaseDate", label: "출시일" },
    ],
  },
  {
    title: "성능",
    description: "칩, 메모리, 저장 용량",
    rows: [
      { key: "processor", label: "프로세서" },
      { key: "memory", label: "메모리" },
      { key: "storage", label: "저장 용량" },
    ],
  },
  {
    title: "디스플레이",
    description: "화면 크기와 표현 방식",
    rows: [
      { key: "displayPanel", label: "패널" },
      { key: "displaySize", label: "화면 크기" },
      { key: "displayResolution", label: "해상도" },
      { key: "refreshRate", label: "재생률" },
      { key: "displayFeatures", label: "주요 기능" },
    ],
  },
  {
    title: "카메라",
    description: "후면 시스템, 줌, 동영상",
    rows: [
      { key: "rearCameras", label: "후면 카메라" },
      { key: "telephoto", label: "망원" },
      { key: "digitalZoom", label: "디지털 줌" },
      { key: "frontCamera", label: "전면 카메라" },
      { key: "videoRecording", label: "동영상 촬영" },
    ],
  },
  {
    title: "배터리와 충전",
    description: "제조사 시험 기준",
    rows: [
      { key: "batteryCapacity", label: "배터리 용량" },
      { key: "videoPlayback", label: "동영상 재생" },
      { key: "fastCharging", label: "유선 충전" },
      { key: "wirelessCharging", label: "무선 충전" },
    ],
  },
  {
    title: "연결과 내구성",
    description: "단자, 네트워크, 생체 인증, 방수",
    rows: [
      { key: "wiredConnection", label: "유선 연결" },
      { key: "wireless", label: "무선 연결" },
      { key: "biometrics", label: "생체 인증" },
      { key: "waterResistance", label: "방수·방진" },
    ],
  },
] as const;

export const cameraSpecificationSections = [
  {
    title: "기본 정보",
    description: "제품군과 촬영 핵심 사양",
    rows: [
      { key: "cameraType", label: "카메라 유형" },
      { key: "series", label: "시리즈" },
      { key: "sensorFormat", label: "센서 포맷" },
      { key: "effectiveMegapixels", label: "유효 화소" },
      { key: "imageProcessor", label: "이미지 프로세서" },
      { key: "releaseDate", label: "출시월" },
    ],
  },
  {
    title: "촬영 성능",
    description: "렌즈 호환성과 연속 촬영·동영상",
    rows: [
      { key: "lensMount", label: "렌즈 마운트" },
      { key: "maxContinuousFps", label: "최대 연사" },
      { key: "videoSpec", label: "동영상 촬영" },
    ],
  },
  {
    title: "크기와 무게",
    description: "배터리와 메모리 카드를 제외한 본체 기준",
    rows: [{ key: "bodyWeight", label: "본체 무게" }],
  },
] as const;

export type SpecificationSection = {
  title: string;
  description: string;
  rows: readonly { key: string; label: string }[];
};

const SUB_DISPLAY_ROWS = [
  { suffix: "DisplayPanel", label: "패널" },
  { suffix: "DisplaySize", label: "화면 크기" },
  { suffix: "DisplayResolution", label: "해상도" },
  { suffix: "RefreshRate", label: "주사율" },
  { suffix: "DisplayFeatures", label: "주요 기능" },
] as const;

export const SUB_DISPLAY_COUNT = 2;

export function subDisplayKeys(sub: number): string[] {
  return [
    `sub${sub}DisplayName`,
    ...SUB_DISPLAY_ROWS.map(({ suffix }) => `sub${sub}${suffix}`),
  ];
}

// Sections for a smartphone table. Foldables with sub displays get one extra
// section per sub display right after 디스플레이 (rendered only when at least
// one compared device has it) and the main one is renamed 메인 디스플레이; with
// only a main display it stays plain 디스플레이.
export function getSpecificationSections(
  devices: readonly { specs: Record<string, { value: string } | undefined> }[],
): readonly SpecificationSection[] {
  const subCount = [1, 2].filter((sub) =>
    devices.some((device) => `sub${sub}DisplaySize` in device.specs),
  ).length;
  if (subCount === 0) return specificationSections;

  return (
    specificationSections as readonly SpecificationSection[]
  ).flatMap<SpecificationSection>((section) =>
    section.title === "디스플레이"
      ? [
          { ...section, title: "메인 디스플레이" },
          ...Array.from({ length: subCount }, (_, index) => ({
            title:
              devices
                .map(
                  (device) => device.specs[`sub${index + 1}DisplayName`]?.value,
                )
                .find(Boolean) ?? `서브${index + 1} 디스플레이`,
            description: "보조 화면",
            rows: SUB_DISPLAY_ROWS.map(({ suffix, label }) => ({
              key: `sub${index + 1}${suffix}`,
              label,
            })),
          })),
        ]
      : [section],
  );
}

export type SpecificationRowKey =
  (typeof specificationSections)[number]["rows"][number]["key"];
export type CameraSpecificationRowKey =
  (typeof cameraSpecificationSections)[number]["rows"][number]["key"];
export type SpecKey = Exclude<SpecificationRowKey, "releaseDate"> | "stylus";

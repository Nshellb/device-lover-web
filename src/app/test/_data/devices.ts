import type {
  Device,
  DeviceCategory,
  SpecKey,
  SpecValue,
} from "@/features/devices/model/device";

type DeviceSpecs = Record<SpecKey, SpecValue>;
type DeviceFixture = Omit<Device, "category" | "specs"> & {
  category?: DeviceCategory;
  specs?: Partial<DeviceSpecs>;
};

function createDevice(
  baseSpecs: DeviceSpecs,
  fixture: DeviceFixture,
): Device {
  return {
    ...fixture,
    category: fixture.category ?? "smartphone",
    specs: {
      ...baseSpecs,
      ...fixture.specs,
    },
  };
}

const galaxyS24Specs: DeviceSpecs = {
  operatingSystem: { value: "Android 14", detail: "One UI 6.1" },
  colors: {
    value: "앰버 옐로우, 코발트 바이올렛, 마블 그레이, 오닉스 블랙",
    detail: "전용 색상: 사파이어 블루, 샌드스톤 오렌지, 제이드 그린",
  },
  dimensions: { value: "147.0 × 70.6 × 7.6 mm" },
  weight: { value: "167 g" },
  storage: { value: "256GB, 512GB" },
  stylus: { value: "미지원", muted: true },
  displayPanel: { value: "Dynamic AMOLED 2X" },
  displaySize: { value: "156.4 mm", detail: "약 6.2형" },
  displayResolution: { value: "2340 × 1080", detail: "FHD+" },
  refreshRate: { value: "최대 120Hz" },
  displayFeatures: { value: "Vision Booster", detail: "Always On Display" },
  processor: { value: "Exynos 2400" },
  memory: { value: "8GB" },
  wiredConnection: { value: "USB Type-C", detail: "USB 3.2 Gen 1" },
  speakers: { value: "스테레오" },
  rearCameras: {
    value: "50MP + 10MP + 12MP",
    detail: "광각, 망원, 초광각",
  },
  telephoto: { value: "3배 광학 줌", detail: "2배 광학 퀄리티" },
  digitalZoom: { value: "최대 30배" },
  frontCamera: { value: "12MP", detail: "F2.2" },
  videoRecording: { value: "최대 8K 30fps" },
  batteryCapacity: { value: "4,000 mAh", detail: "Typical" },
  videoPlayback: { value: "최대 29시간", detail: "Samsung 시험 기준" },
  fastCharging: { value: "최대 25W", detail: "유선 충전" },
  wirelessCharging: { value: "지원" },
  wireless: { value: "5G, Wi-Fi 6E, Bluetooth 5.3" },
  biometrics: { value: "초음파 지문 인식", detail: "얼굴 인식" },
  waterResistance: { value: "IP68" },
};

const galaxyS25Specs: DeviceSpecs = {
  ...galaxyS24Specs,
  operatingSystem: { value: "Android 15", detail: "One UI 7" },
  colors: {
    value: "아이스블루, 네이비, 실버 쉐도우, 민트",
    detail: "전용 색상: 블루블랙, 코랄레드, 핑크골드",
  },
  dimensions: { value: "146.9 × 70.5 × 7.2 mm" },
  weight: { value: "162 g" },
  processor: { value: "Snapdragon 8 Elite", detail: "for Galaxy" },
  memory: { value: "12GB" },
  wireless: { value: "5G, Wi-Fi 7, Bluetooth 5.4" },
};

const galaxyS26Specs: DeviceSpecs = {
  ...galaxyS25Specs,
  operatingSystem: { value: "Android 16", detail: "One UI 8.5" },
  colors: {
    value: "코발트 바이올렛, 스카이 블루, 블랙, 화이트",
    detail: "전용 색상: 핑크 골드, 실버 쉐도우",
  },
  dimensions: { value: "149.6 × 71.7 × 7.2 mm" },
  weight: { value: "167 g" },
  displaySize: { value: "159.3 mm", detail: "약 6.3형" },
  processor: { value: "Exynos 2600" },
  batteryCapacity: { value: "4,300 mAh", detail: "Typical" },
  videoPlayback: { value: "최대 30시간", detail: "Samsung 시험 기준" },
  videoRecording: { value: "최대 8K 60fps" },
};

const iphone16Specs: DeviceSpecs = {
  operatingSystem: { value: "iOS 18" },
  colors: { value: "블랙, 화이트, 핑크, 틸, 울트라마린" },
  dimensions: { value: "147.6 × 71.6 × 7.80 mm" },
  weight: { value: "170 g" },
  storage: { value: "128GB, 256GB, 512GB" },
  stylus: { value: "미지원", muted: true },
  displayPanel: { value: "Super Retina XDR OLED" },
  displaySize: { value: "15.5 cm", detail: "약 6.1형" },
  displayResolution: { value: "2556 × 1179", detail: "460 ppi" },
  refreshRate: { value: "60Hz" },
  displayFeatures: { value: "Dynamic Island", detail: "HDR 디스플레이" },
  processor: { value: "A18" },
  memory: { value: "공식 미공개", muted: true },
  wiredConnection: { value: "USB Type-C", detail: "USB 2" },
  speakers: { value: "스테레오" },
  rearCameras: { value: "48MP + 12MP", detail: "메인, 초광각" },
  telephoto: { value: "2배 광학 퀄리티" },
  digitalZoom: { value: "최대 10배" },
  frontCamera: { value: "12MP", detail: "TrueDepth" },
  videoRecording: { value: "최대 4K 60fps", detail: "Dolby Vision" },
  batteryCapacity: { value: "공식 미공개", muted: true },
  videoPlayback: { value: "최대 22시간", detail: "Apple 시험 기준" },
  fastCharging: { value: "약 30분에 최대 50%" },
  wirelessCharging: { value: "최대 25W", detail: "MagSafe, Qi2" },
  wireless: { value: "5G, Wi-Fi 7, Bluetooth 5.3" },
  biometrics: { value: "Face ID" },
  waterResistance: { value: "IP68", detail: "최대 수심 6m, 30분" },
};

const iphone17Specs: DeviceSpecs = {
  ...iphone16Specs,
  operatingSystem: { value: "iOS 26" },
  colors: { value: "블랙, 화이트, 미스트 블루, 세이지, 라벤더" },
  dimensions: { value: "149.6 × 71.5 × 7.95 mm" },
  weight: { value: "177 g" },
  storage: { value: "256GB, 512GB" },
  displaySize: { value: "15.9 cm", detail: "약 6.3형" },
  displayResolution: { value: "2622 × 1206", detail: "460 ppi" },
  refreshRate: { value: "최대 120Hz", detail: "ProMotion" },
  displayFeatures: {
    value: "상시표시형 디스플레이",
    detail: "Dynamic Island",
  },
  processor: { value: "A19" },
  rearCameras: { value: "48MP + 48MP", detail: "메인, 초광각" },
  frontCamera: { value: "18MP", detail: "Center Stage" },
  videoPlayback: { value: "최대 30시간", detail: "Apple 시험 기준" },
  fastCharging: { value: "약 20분에 최대 50%" },
  wireless: { value: "5G, Wi-Fi 7, Bluetooth 6" },
};

const iphone18ProSpecs: DeviceSpecs = {
  ...iphone17Specs,
  operatingSystem: { value: "iOS 27" },
  colors: { value: "블랙, 실버, 글레이셔, 버건디" },
  dimensions: { value: "150.0 × 71.9 × 8.75 mm" },
  weight: { value: "211 g" },
  storage: { value: "256GB, 512GB, 1TB, 2TB" },
  processor: { value: "A20 Pro", detail: "6코어 CPU, 7코어 GPU" },
  wiredConnection: { value: "USB Type-C", detail: "USB 3, 최대 10Gb/s" },
  rearCameras: {
    value: "48MP + 48MP + 48MP",
    detail: "메인, 초광각, 망원",
  },
  telephoto: { value: "4배 망원", detail: "8배 광학 퀄리티" },
  digitalZoom: { value: "최대 40배" },
  frontCamera: { value: "18MP", detail: "Center Stage, F1.9" },
  videoRecording: { value: "최대 4K 120fps", detail: "Dolby Vision" },
  videoPlayback: { value: "최대 34시간", detail: "Apple 시험 기준" },
  fastCharging: {
    value: "약 15분에 최대 50%",
    detail: "AVS 지원 60W 이상 어댑터 사용 시",
  },
};

const deviceCatalog: Device[] = [
  createDevice(galaxyS24Specs, {
    slug: "galaxy-s24",
    aliases: ["sm-s921"],
    brand: "SAMSUNG",
    name: "Galaxy S24",
    releaseDate: "2024-01-31",
    variant: "8GB, 512GB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s24/specs/images/spec-galaxy-s24-cobalt-violet.png",
    sourceUrl: "https://www.samsung.com/sec/smartphones/galaxy-s24/specs/",
  }),
  createDevice(galaxyS24Specs, {
    slug: "galaxy-s24-plus",
    aliases: ["sm-s926", "galaxy-s24+"],
    brand: "SAMSUNG",
    name: "Galaxy S24+",
    releaseDate: "2024-01-31",
    variant: "12GB, 512GB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s24/specs/images/spec-galaxy-s24-plus-cobalt-violet.png",
    sourceUrl: "https://www.samsung.com/sec/smartphones/galaxy-s24/specs/",
    specs: {
      dimensions: { value: "158.5 × 75.9 × 7.7 mm" },
      weight: { value: "196 g" },
      displaySize: { value: "169.1 mm", detail: "약 6.7형" },
      displayResolution: { value: "3120 × 1440", detail: "Quad HD+" },
      memory: { value: "12GB" },
      batteryCapacity: { value: "4,900 mAh", detail: "Typical" },
      videoPlayback: { value: "최대 31시간", detail: "Samsung 시험 기준" },
      fastCharging: { value: "최대 45W", detail: "유선 충전" },
    },
  }),
  createDevice(galaxyS24Specs, {
    slug: "galaxy-s24-ultra",
    aliases: ["sm-s928"],
    brand: "SAMSUNG",
    name: "Galaxy S24 Ultra",
    releaseDate: "2024-01-31",
    variant: "12GB, 1TB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s24-ultra/specs/images/spec-galaxy-s24-ultra-titanium-violet.png",
    sourceUrl:
      "https://www.samsung.com/sec/smartphones/galaxy-s24-ultra/specs/",
    specs: {
      colors: {
        value: "티타늄 그레이, 티타늄 옐로우, 티타늄 바이올렛, 티타늄 블랙",
        detail: "전용 색상: 티타늄 블루, 티타늄 오렌지, 티타늄 그린",
      },
      dimensions: { value: "162.3 × 79.0 × 8.6 mm" },
      weight: { value: "232 g" },
      storage: { value: "256GB, 512GB, 1TB" },
      stylus: { value: "S Pen 내장" },
      displaySize: { value: "172.5 mm", detail: "약 6.8형" },
      displayResolution: { value: "3120 × 1440", detail: "Quad HD+" },
      displayFeatures: { value: "반사 방지 코팅", detail: "Vision Booster" },
      processor: { value: "Snapdragon 8 Gen 3", detail: "for Galaxy" },
      memory: { value: "12GB" },
      rearCameras: {
        value: "200MP + 12MP + 50MP + 10MP",
        detail: "광각, 초광각, 망원 2종",
      },
      telephoto: { value: "3배, 5배 광학 줌", detail: "10배 광학 퀄리티" },
      digitalZoom: { value: "최대 100배" },
      batteryCapacity: { value: "5,000 mAh", detail: "Typical" },
      videoPlayback: { value: "최대 30시간", detail: "Samsung 시험 기준" },
      fastCharging: { value: "최대 45W", detail: "유선 충전" },
      wireless: { value: "5G, Wi-Fi 7, Bluetooth 5.3" },
    },
  }),
  createDevice(galaxyS25Specs, {
    slug: "galaxy-s25",
    aliases: ["sm-s931"],
    brand: "SAMSUNG",
    name: "Galaxy S25",
    releaseDate: "2025-02-07",
    variant: "12GB, 512GB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s25/specs/images/spec-galaxy-s25-icyblue.jpg",
    sourceUrl: "https://www.samsung.com/sec/smartphones/galaxy-s25/specs/",
  }),
  createDevice(galaxyS25Specs, {
    slug: "galaxy-s25-plus",
    aliases: ["sm-s936", "galaxy-s25+"],
    brand: "SAMSUNG",
    name: "Galaxy S25+",
    releaseDate: "2025-02-07",
    variant: "12GB, 512GB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s25/specs/images/spec-galaxy-s25-plus-icyblue.jpg",
    sourceUrl: "https://www.samsung.com/sec/smartphones/galaxy-s25/specs/",
    specs: {
      dimensions: { value: "158.4 × 75.8 × 7.3 mm" },
      weight: { value: "190 g" },
      displaySize: { value: "169.1 mm", detail: "약 6.7형" },
      displayResolution: { value: "3120 × 1440", detail: "Quad HD+" },
      batteryCapacity: { value: "4,900 mAh", detail: "Typical" },
      videoPlayback: { value: "최대 30시간", detail: "Samsung 시험 기준" },
      fastCharging: { value: "최대 45W", detail: "유선 충전" },
    },
  }),
  createDevice(galaxyS25Specs, {
    slug: "galaxy-s25-ultra",
    aliases: ["sm-s938"],
    brand: "SAMSUNG",
    name: "Galaxy S25 Ultra",
    releaseDate: "2025-02-07",
    variant: "16GB, 1TB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s25-ultra/specs/images/spec-galaxy-s25-ultra-titanium-silverblue.jpg",
    sourceUrl:
      "https://www.samsung.com/sec/smartphones/galaxy-s25-ultra/specs/",
    specs: {
      colors: {
        value: "티타늄 실버블루, 티타늄 블랙, 티타늄 그레이, 티타늄 화이트실버",
        detail: "추가 색상: 티타늄 제트블랙, 티타늄 제이드그린, 티타늄 핑크골드",
      },
      dimensions: { value: "162.8 × 77.6 × 8.2 mm" },
      weight: { value: "218 g" },
      storage: { value: "256GB, 512GB, 1TB" },
      stylus: { value: "S Pen 내장" },
      displaySize: { value: "174.2 mm", detail: "약 6.9형" },
      displayResolution: { value: "3120 × 1440", detail: "Quad HD+" },
      displayFeatures: { value: "반사 방지 코팅", detail: "Vision Booster" },
      memory: { value: "12GB / 16GB", detail: "용량별 상이" },
      rearCameras: {
        value: "200MP + 50MP + 50MP + 10MP",
        detail: "광각, 초광각, 망원 2종",
      },
      telephoto: { value: "3배, 5배 광학 줌", detail: "10배 광학 퀄리티" },
      digitalZoom: { value: "최대 100배" },
      batteryCapacity: { value: "5,000 mAh", detail: "Typical" },
      videoPlayback: { value: "최대 31시간", detail: "Samsung 시험 기준" },
      fastCharging: { value: "최대 45W", detail: "유선 충전" },
    },
  }),
  createDevice(galaxyS26Specs, {
    slug: "galaxy-s26",
    aliases: ["sm-s942"],
    brand: "SAMSUNG",
    name: "Galaxy S26",
    releaseDate: "2026-03-11",
    variant: "12GB, 512GB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s26/specs/images/spec-galaxy-s26-cobalt-violet.jpg",
    sourceUrl: "https://www.samsung.com/sec/smartphones/galaxy-s26/specs/",
  }),
  createDevice(galaxyS26Specs, {
    slug: "galaxy-s26-plus",
    aliases: ["sm-s947", "galaxy-s26+"],
    brand: "SAMSUNG",
    name: "Galaxy S26+",
    releaseDate: "2026-03-11",
    variant: "12GB, 512GB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s26/specs/images/spec-galaxy-s26-plus-cobalt-violet.jpg",
    sourceUrl: "https://www.samsung.com/sec/smartphones/galaxy-s26/specs/",
    specs: {
      dimensions: { value: "158.4 × 75.8 × 7.3 mm" },
      weight: { value: "190 g" },
      displaySize: { value: "169.1 mm", detail: "약 6.7형" },
      displayResolution: { value: "3120 × 1440", detail: "Quad HD+" },
      batteryCapacity: { value: "4,900 mAh", detail: "Typical" },
      videoPlayback: { value: "최대 31시간", detail: "Samsung 시험 기준" },
      fastCharging: { value: "최대 45W", detail: "유선 충전" },
      wireless: { value: "5G, Wi-Fi 7, Bluetooth 6.0" },
    },
  }),
  createDevice(galaxyS26Specs, {
    slug: "galaxy-s26-ultra",
    aliases: ["sm-s948"],
    brand: "SAMSUNG",
    name: "Galaxy S26 Ultra",
    releaseDate: "2026-03-11",
    variant: "16GB, 1TB",
    visual: "galaxy",
    imageUrl: "https://images.samsung.com/sec/smartphones/galaxy-s26-ultra/specs/images/spec-galaxy-s26-ultra-cobalt-violet.jpg",
    sourceUrl:
      "https://www.samsung.com/sec/smartphones/galaxy-s26-ultra/specs/",
    specs: {
      dimensions: { value: "163.6 × 78.1 × 7.9 mm" },
      weight: { value: "214 g" },
      storage: { value: "256GB, 512GB, 1TB" },
      stylus: { value: "S Pen 내장" },
      displaySize: { value: "174.9 mm", detail: "약 6.9형" },
      displayResolution: { value: "3120 × 1440", detail: "Quad HD+" },
      displayFeatures: {
        value: "Privacy Display",
        detail: "반사 방지 코팅",
      },
      processor: {
        value: "Snapdragon 8 Elite 5세대",
        detail: "for Galaxy",
      },
      memory: { value: "12GB / 16GB", detail: "용량별 상이" },
      rearCameras: {
        value: "200MP + 50MP + 50MP + 10MP",
        detail: "광각, 초광각, 망원 2종",
      },
      telephoto: {
        value: "3배, 5배 광학 줌",
        detail: "10배 광학 퀄리티",
      },
      digitalZoom: { value: "최대 100배" },
      videoRecording: { value: "최대 8K 30fps" },
      batteryCapacity: {
        value: "5,000 mAh",
        detail: "Typical, 정격 4,855 mAh",
      },
      videoPlayback: {
        value: "최대 31시간",
        detail: "Samsung 시험 기준",
      },
      fastCharging: {
        value: "약 30분에 최대 75%",
        detail: "호환 고속 충전기 사용 시",
      },
      wireless: { value: "5G, Wi-Fi 7, Bluetooth 6.0" },
    },
  }),
  createDevice(iphone16Specs, {
    slug: "iphone-16",
    aliases: [],
    brand: "APPLE",
    name: "iPhone 16",
    releaseDate: "2024-09-20",
    variant: "512GB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-16.png",
    sourceUrl: "https://support.apple.com/ko-kr/121029",
  }),
  createDevice(iphone16Specs, {
    slug: "iphone-16-plus",
    aliases: [],
    brand: "APPLE",
    name: "iPhone 16 Plus",
    releaseDate: "2024-09-20",
    variant: "512GB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121030-iphone-16-plus.png",
    sourceUrl: "https://support.apple.com/ko-kr/121030",
    specs: {
      dimensions: { value: "160.9 × 77.8 × 7.80 mm" },
      weight: { value: "199 g" },
      displaySize: { value: "17.0 cm", detail: "약 6.7형" },
      displayResolution: { value: "2796 × 1290", detail: "460 ppi" },
      videoPlayback: { value: "최대 27시간", detail: "Apple 시험 기준" },
    },
  }),
  createDevice(iphone16Specs, {
    slug: "iphone-16-pro",
    aliases: [],
    brand: "APPLE",
    name: "iPhone 16 Pro",
    releaseDate: "2024-09-20",
    variant: "1TB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121031-iphone-16-pro.png",
    sourceUrl: "https://support.apple.com/ko-kr/121031",
    specs: {
      colors: {
        value: "블랙 티타늄, 화이트 티타늄, 내추럴 티타늄, 데저트 티타늄",
      },
      dimensions: { value: "149.6 × 71.5 × 8.25 mm" },
      weight: { value: "199 g" },
      storage: { value: "128GB, 256GB, 512GB, 1TB" },
      displaySize: { value: "15.9 cm", detail: "약 6.3형" },
      displayResolution: { value: "2622 × 1206", detail: "460 ppi" },
      refreshRate: { value: "최대 120Hz", detail: "ProMotion" },
      displayFeatures: {
        value: "상시표시형 디스플레이",
        detail: "Dynamic Island",
      },
      processor: { value: "A18 Pro" },
      wiredConnection: { value: "USB Type-C", detail: "USB 3, 최대 10Gb/s" },
      rearCameras: {
        value: "48MP + 48MP + 12MP",
        detail: "메인, 초광각, 망원",
      },
      telephoto: { value: "5배 광학 줌" },
      digitalZoom: { value: "최대 25배" },
      videoRecording: { value: "최대 4K 120fps", detail: "Dolby Vision" },
      videoPlayback: { value: "최대 27시간", detail: "Apple 시험 기준" },
    },
  }),
  createDevice(iphone16Specs, {
    slug: "iphone-16-pro-max",
    aliases: [],
    brand: "APPLE",
    name: "iPhone 16 Pro Max",
    releaseDate: "2024-09-20",
    variant: "1TB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121032-iphone-16-pro-max.png",
    sourceUrl: "https://support.apple.com/ko-kr/121032",
    specs: {
      colors: {
        value: "블랙 티타늄, 화이트 티타늄, 내추럴 티타늄, 데저트 티타늄",
      },
      dimensions: { value: "163.0 × 77.6 × 8.25 mm" },
      weight: { value: "227 g" },
      storage: { value: "256GB, 512GB, 1TB" },
      displaySize: { value: "17.4 cm", detail: "약 6.9형" },
      displayResolution: { value: "2868 × 1320", detail: "460 ppi" },
      refreshRate: { value: "최대 120Hz", detail: "ProMotion" },
      displayFeatures: {
        value: "상시표시형 디스플레이",
        detail: "Dynamic Island",
      },
      processor: { value: "A18 Pro" },
      wiredConnection: { value: "USB Type-C", detail: "USB 3, 최대 10Gb/s" },
      rearCameras: {
        value: "48MP + 48MP + 12MP",
        detail: "메인, 초광각, 망원",
      },
      telephoto: { value: "5배 광학 줌" },
      digitalZoom: { value: "최대 25배" },
      videoRecording: { value: "최대 4K 120fps", detail: "Dolby Vision" },
      videoPlayback: { value: "최대 33시간", detail: "Apple 시험 기준" },
    },
  }),
  createDevice(iphone17Specs, {
    slug: "iphone-17",
    aliases: [],
    brand: "APPLE",
    name: "iPhone 17",
    releaseDate: "2025-09-19",
    variant: "512GB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-hero.png",
    sourceUrl: "https://support.apple.com/ko-kr/125089",
  }),
  createDevice(iphone17Specs, {
    slug: "iphone-air",
    aliases: ["iphone-17-air"],
    brand: "APPLE",
    name: "iPhone Air",
    releaseDate: "2025-09-19",
    variant: "1TB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-air-hero.png",
    sourceUrl: "https://support.apple.com/ko-kr/125092",
    specs: {
      colors: { value: "스페이스 블랙, 클라우드 화이트, 라이트 골드, 스카이 블루" },
      speakers: { value: "모노", detail: "내장 스피커 1개" },
      dimensions: { value: "156.2 × 74.7 × 5.64 mm" },
      weight: { value: "165 g" },
      storage: { value: "256GB, 512GB, 1TB" },
      displaySize: { value: "16.6 cm", detail: "약 6.5형" },
      displayResolution: { value: "2736 × 1260", detail: "460 ppi" },
      processor: { value: "A19 Pro", detail: "5코어 GPU" },
      rearCameras: { value: "48MP", detail: "Fusion 메인" },
      videoPlayback: { value: "최대 27시간", detail: "Apple 시험 기준" },
      fastCharging: { value: "약 30분에 최대 50%" },
      wirelessCharging: { value: "최대 20W", detail: "MagSafe, Qi2" },
    },
  }),
  createDevice(iphone17Specs, {
    slug: "iphone-17-pro",
    aliases: [],
    brand: "APPLE",
    name: "iPhone 17 Pro",
    releaseDate: "2025-09-19",
    variant: "1TB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png",
    sourceUrl: "https://support.apple.com/ko-kr/125090",
    specs: {
      colors: { value: "실버, 코스믹 오렌지, 딥 블루" },
      dimensions: { value: "150.0 × 71.9 × 8.75 mm" },
      weight: { value: "204 g" },
      storage: { value: "256GB, 512GB, 1TB" },
      processor: { value: "A19 Pro" },
      wiredConnection: { value: "USB Type-C", detail: "USB 3, 최대 10Gb/s" },
      rearCameras: {
        value: "48MP + 48MP + 48MP",
        detail: "메인, 초광각, 망원",
      },
      telephoto: { value: "4배 망원", detail: "8배 광학 퀄리티" },
      digitalZoom: { value: "최대 40배" },
      videoRecording: { value: "최대 4K 120fps", detail: "Dolby Vision" },
      videoPlayback: { value: "최대 31시간", detail: "Apple 시험 기준" },
    },
  }),
  createDevice(iphone17Specs, {
    slug: "iphone-17-pro-max",
    aliases: [],
    brand: "APPLE",
    name: "iPhone 17 Pro Max",
    releaseDate: "2025-09-19",
    variant: "2TB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png",
    sourceUrl: "https://support.apple.com/ko-kr/125091",
    specs: {
      colors: { value: "실버, 코스믹 오렌지, 딥 블루" },
      dimensions: { value: "163.4 × 78.0 × 8.75 mm" },
      weight: { value: "231 g" },
      storage: { value: "256GB, 512GB, 1TB, 2TB" },
      displaySize: { value: "17.4 cm", detail: "약 6.9형" },
      displayResolution: { value: "2868 × 1320", detail: "460 ppi" },
      processor: { value: "A19 Pro" },
      wiredConnection: { value: "USB Type-C", detail: "USB 3, 최대 10Gb/s" },
      rearCameras: {
        value: "48MP + 48MP + 48MP",
        detail: "메인, 초광각, 망원",
      },
      telephoto: { value: "4배 망원", detail: "8배 광학 퀄리티" },
      digitalZoom: { value: "최대 40배" },
      videoRecording: { value: "최대 4K 120fps", detail: "Dolby Vision" },
      videoPlayback: { value: "최대 37시간", detail: "Apple 시험 기준" },
    },
  }),
  createDevice(iphone18ProSpecs, {
    slug: "iphone-18-pro",
    aliases: ["a3714", "iphone19,3"],
    brand: "APPLE",
    name: "iPhone 18 Pro",
    releaseDate: "2026-09-18",
    variant: "2TB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-18-pro.png",
    sourceUrl: "https://www.apple.com/kr/iphone-18-pro/specs/",
  }),
  createDevice(iphone18ProSpecs, {
    slug: "iphone-18-pro-max",
    aliases: ["a3717"],
    brand: "APPLE",
    name: "iPhone 18 Pro Max",
    releaseDate: "2026-09-18",
    variant: "2TB",
    visual: "iphone",
    imageUrl: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-18-pro-max.png",
    sourceUrl: "https://www.apple.com/kr/iphone-18-pro/specs/",
    specs: {
      dimensions: { value: "163.4 × 78.0 × 8.75 mm" },
      weight: { value: "249 g" },
      displaySize: { value: "17.4 cm", detail: "약 6.9형" },
      displayResolution: { value: "2868 × 1320", detail: "460 ppi" },
      videoPlayback: { value: "최대 43시간", detail: "Apple 시험 기준" },
    },
  }),
];

function normalizeDeviceIdentifier(identifier: string): string {
  let decodedIdentifier = identifier;

  try {
    decodedIdentifier = decodeURIComponent(identifier);
  } catch {
    // 잘못 인코딩된 값은 원문으로 조회해 일치하지 않으면 404로 처리합니다.
  }

  return decodedIdentifier
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[\s_]+/g, "-");
}

const deviceByIdentifier = new Map<string, Device>();

for (const device of deviceCatalog) {
  const identifiers = [device.slug, device.name, ...device.aliases];

  for (const identifier of identifiers) {
    const normalizedIdentifier = normalizeDeviceIdentifier(identifier);
    const existingDevice = deviceByIdentifier.get(normalizedIdentifier);

    if (existingDevice && existingDevice.slug !== device.slug) {
      throw new Error(`중복된 기기 식별자입니다: ${identifier}`);
    }

    deviceByIdentifier.set(normalizedIdentifier, device);
  }
}

export function getDeviceByIdentifier(identifier: string): Device | undefined {
  return deviceByIdentifier.get(normalizeDeviceIdentifier(identifier));
}

export function getDeviceBySlug(slug: string): Device | undefined {
  return getDeviceByIdentifier(slug);
}

export function searchDevices(query: string): Device[] {
  const normalizedQuery = normalizeDeviceIdentifier(query);

  if (!normalizedQuery) {
    return [];
  }

  return deviceCatalog.filter((device) =>
    [device.slug, device.name, ...device.aliases].some((identifier) =>
      normalizeDeviceIdentifier(identifier).includes(normalizedQuery),
    ),
  );
}

export function getAllDevices(): Device[] {
  return [...deviceCatalog];
}

export function getLatestReleasedDevicePair(): [Device, Device] {
  const latestDevices = [...deviceCatalog]
    .sort(
      (firstDevice, secondDevice) =>
        secondDevice.releaseDate.localeCompare(firstDevice.releaseDate) ||
        firstDevice.slug.localeCompare(secondDevice.slug),
    )
    .slice(0, 2);

  if (latestDevices.length < 2) {
    throw new Error("메인 비교 화면에는 출시된 기기가 두 대 이상 필요합니다.");
  }

  return [latestDevices[0], latestDevices[1]];
}

export function getDevicesFromSegment(segment: string): Device[] | null {
  const identifiers = segment.split(/-vs-/i);

  if (
    identifiers.length < 1 ||
    identifiers.length > 3 ||
    identifiers.some((identifier) => identifier.length === 0)
  ) {
    return null;
  }

  const selectedDevices = identifiers.map(getDeviceByIdentifier);

  if (selectedDevices.some((device) => device === undefined)) {
    return null;
  }

  const resolvedDevices = selectedDevices as Device[];

  if (
    new Set(resolvedDevices.map((device) => device.slug)).size !==
    resolvedDevices.length
  ) {
    return null;
  }

  return resolvedDevices;
}

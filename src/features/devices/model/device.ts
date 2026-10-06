export type SpecValueBlock = {
  label: string;
  value: string;
  detail?: string;
};

export type SpecValue = {
  value: string;
  detail?: string;
  // When set, the cell renders these blocks stacked top to bottom instead of
  // value/detail (e.g. main + sub displays of a foldable).
  blocks?: SpecValueBlock[];
};

export type DeviceCategory = "smartphone" | "camera";

export type DeviceColor = {
  id: string;
  name: string;
  imageUrl: string | null;
  colorCode: string | null;
  exclusive: boolean;
};

export type DeviceSearchItem = {
  category: DeviceCategory;
  slug: string;
  name: string;
  brand: string;
  releaseDate: string;
  aliases: readonly string[];
};

export type DeviceDimension = {
  label: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
};

export type Device = {
  category: DeviceCategory;
  slug: string;
  aliases: readonly string[];
  modelNumbers: readonly string[];
  brand: string;
  name: string;
  releaseDate: string;
  variant: string;
  visual: "galaxy" | "iphone" | "camera" | "other";
  imageUrl: string | null;
  imageAlt?: string | null;
  colors: readonly DeviceColor[];
  sourceUrl: string;
  specs: Record<string, SpecValue>;
  // Numeric size entries (e.g. 펼친 상태 / 접은 상태) for the 크기 drawings;
  // the text form lives in specs.dimensions.
  dimensions?: readonly DeviceDimension[];
};

export type {
  SpecificationRowKey,
  CameraSpecificationRowKey,
  SpecKey,
} from "./specification-sections";

export type SpecValue = {
  value: string;
  detail?: string;
  muted?: boolean;
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

export type Device = {
  category: DeviceCategory;
  slug: string;
  aliases: readonly string[];
  brand: string;
  name: string;
  releaseDate: string;
  variant: string;
  visual: "galaxy" | "iphone" | "camera";
  imageUrl: string | null;
  colors: readonly DeviceColor[];
  sourceUrl: string;
  specs: Record<string, SpecValue>;
};

export type {
  SpecificationRowKey,
  CameraSpecificationRowKey,
  SpecKey,
} from "./specification-sections";

// Mirrors the JSON contract served by device-lover-api (src/dto/catalog.rs).
// Field names are camelCase to match the API's #[serde(rename_all = "camelCase")] output.

export type ApiSpecValue = {
  value: string;
  detail: string | null;
  sourceId: string | null;
};

export type ApiDeviceSummary = {
  id: string;
  slug: string;
  category: string;
  brand: string;
  brandSlug: string;
  name: string;
  releaseDate: string;
  marketCode: string;
  aliases: string[];
  modelNumbers: string[];
  imageUrl: string | null;
};

export type ApiCamera = {
  id: string;
  category: "camera";
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  series: string;
  releaseMonth: string;
  cameraType: string;
  sensorFormat: "full_frame" | "aps_c";
  effectiveMegapixels: number;
  imageProcessor: string;
  lensMount: string;
  maxContinuousFps: number;
  continuousShootingNote: string | null;
  videoSpec: string;
  bodyWeightG: number;
  sourceUrl: string;
  sourceTitle: string;
  checkedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiDeviceConfiguration = {
  id: string;
  label: string;
  storageGb: number;
  ramGb: number | null;
};

export type ApiDeviceColor = {
  id: string;
  name: string;
  imageUrl: string | null;
  colorCode: string | null;
  exclusive: boolean;
};

export type ApiDeviceSource = {
  id: string;
  url: string;
  title: string;
  checkedAt: string | null;
  isPrimary: boolean;
};

export type ApiDeviceDetail = ApiDeviceSummary & {
  variant: string | null;
  configurations: ApiDeviceConfiguration[];
  colors: ApiDeviceColor[];
  sourceUrl: string;
  sources: ApiDeviceSource[];
  specs: Record<string, ApiSpecValue>;
  updatedAt: string;
};

export type ApiPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ApiDeviceListResponse = {
  items: ApiDeviceSummary[];
  pagination: ApiPagination;
};

export type ApiCameraListResponse = {
  items: ApiCamera[];
  pagination: ApiPagination;
};

export type ApiComparisonResponse = {
  devices: ApiDeviceDetail[];
  canonicalPath: string;
  schemaVersion: number;
};

export type ApiCameraComparisonResponse = {
  devices: ApiCamera[];
  canonicalPath: string;
  schemaVersion: number;
};

export type ApiHomeResponse = {
  devices: ApiDeviceDetail[];
  canonicalPath: string | null;
  schemaVersion: number;
  asOf: string;
};

export type ApiDeviceSelectionRequest = {
  category: "smartphone" | "camera";
  slug: string;
  action: "view" | "compare";
};

export type ApiPopularDevice = ApiDeviceSummary & {
  selectionCount: number;
};

export type ApiPopularDevicesResponse = {
  items: ApiPopularDevice[];
  windowDays: number;
  cacheTtlSeconds: number;
};

export type ApiCatalogBrand = {
  slug: string;
  name: string;
};

export type ApiSpecificationRow = {
  key: string;
  label: string;
};

export type ApiSpecificationSection = {
  key: string;
  title: string;
  description: string;
  rows: ApiSpecificationRow[];
};

export type ApiCatalogSchemaResponse = {
  schemaVersion: number;
  category: string;
  maxComparisonDevices: number;
  brands: ApiCatalogBrand[];
  sections: ApiSpecificationSection[];
};

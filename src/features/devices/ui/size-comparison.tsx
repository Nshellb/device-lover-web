import type { Device, DeviceDimension } from "../model/device";

type Axis = "widthMm" | "heightMm" | "depthMm";

// Each view projects two axes of the body (세로 ≥ 가로 ≥ 두께, as the API stores them).
// One scale is shared by every view and every compared device, so the drawn
// rectangles compare at true ratio.
export const sizeViews = [
  {
    key: "front",
    label: "정면",
    hint: "가로 × 세로",
    x: "widthMm",
    y: "heightMm",
  },
  {
    key: "side",
    label: "측면",
    hint: "두께 × 세로",
    x: "depthMm",
    y: "heightMm",
  },
  {
    key: "top",
    label: "상단",
    hint: "가로 × 두께",
    x: "widthMm",
    y: "depthMm",
  },
] as const satisfies readonly {
  key: string;
  label: string;
  hint: string;
  x: Axis;
  y: Axis;
}[];

export type SizeView = (typeof sizeViews)[number];

// One drawn rectangle. `tone` picks the colour, `dashed` marks a secondary
// entry of the same device (e.g. 접은 상태), `group` is the device it belongs to.
export type SizeShape = {
  key: string;
  group: string;
  caption: string;
  dimension: DeviceDimension;
  tone: number;
  dashed: boolean;
};

// Pixel length of the largest dimension among the compared devices.
const MAX_PX = 180;

// One palette entry per compared device (or per entry for a single device):
// blue, orange, fuchsia — apart in hue and lightness for colour-blind readers,
// with 600 shades on light and 400 shades on dark so each outline stays legible.
const TONES = [
  {
    stroke: "stroke-blue-600 dark:stroke-blue-400",
    fill: "fill-blue-500/10 dark:fill-blue-400/10",
    fillStrong: "fill-blue-500/25 dark:fill-blue-400/25",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    stroke: "stroke-orange-600 dark:stroke-orange-400",
    fill: "fill-orange-500/10 dark:fill-orange-400/10",
    fillStrong: "fill-orange-500/25 dark:fill-orange-400/25",
    text: "text-orange-600 dark:text-orange-400",
  },
  {
    stroke: "stroke-fuchsia-600 dark:stroke-fuchsia-400",
    fill: "fill-fuchsia-500/10 dark:fill-fuchsia-400/10",
    fillStrong: "fill-fuchsia-500/25 dark:fill-fuchsia-400/25",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
  },
];

export const sizeTone = (tone: number) => TONES[tone % TONES.length];

export function hasSizeDrawing(devices: readonly Device[]): boolean {
  return devices.some((device) => (device.dimensions?.length ?? 0) > 0);
}

// Single device: its entries in different tones, captioned by entry label.
export function deviceSizeShapes(device: Device): SizeShape[] {
  const dimensions = device.dimensions ?? [];
  return dimensions.map((dimension, index) => ({
    key: String(index),
    group: device.slug,
    caption: dimensions.length > 1 ? dimension.label : "",
    dimension,
    tone: index,
    dashed: index > 0,
  }));
}

// Comparison: every device's entries overlaid, one tone per device.
export function comparisonSizeShapes(devices: readonly Device[]): SizeShape[] {
  return devices.flatMap((device, deviceIndex) => {
    const dimensions = device.dimensions ?? [];
    return dimensions.map((dimension, index) => ({
      key: `${device.slug}-${index}`,
      group: device.slug,
      caption:
        dimensions.length > 1
          ? `${device.name} ${dimension.label}`
          : device.name,
      dimension,
      tone: deviceIndex,
      dashed: index > 0,
    }));
  });
}

export function SizeFigure({
  shapes,
  view,
  title = false,
  highlight,
}: {
  shapes: readonly SizeShape[];
  view: SizeView;
  title?: boolean;
  // Device slug drawn on top with a stronger fill; the others fade back.
  highlight?: string;
}) {
  const emphasis = (shape: SizeShape) =>
    highlight === undefined
      ? "normal"
      : shape.group === highlight
        ? "strong"
        : "dim";
  // The highlighted device is painted last so it sits above the others.
  const drawOrder = [...shapes].sort(
    (a, b) => Number(a.group === highlight) - Number(b.group === highlight),
  );
  const largest = Math.max(
    0,
    ...shapes.flatMap(({ dimension }) => [
      dimension.widthMm,
      dimension.heightMm,
    ]),
  );
  const pxPerMm = largest > 0 ? MAX_PX / largest : 0;
  const extent = (axis: Axis) =>
    Math.max(0, ...shapes.map(({ dimension }) => dimension[axis]));
  const canvasW = Math.max(extent(view.x) * pxPerMm, 2) + 2;
  const canvasH = Math.max(extent(view.y) * pxPerMm, 2) + 2;

  return (
    <figure className="flex flex-col items-center gap-2">
      {title ? (
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
          {view.label}
          <span className="ml-1 font-normal text-zinc-400 dark:text-zinc-500">
            {view.hint}
          </span>
        </p>
      ) : null}
      {/* Every view gets the same box height (the longest side), so titles and
          captions line up across views and short views sit vertically centred. */}
      <div
        className="flex items-center justify-center"
        style={{ height: largest * pxPerMm + 2 }}
      >
        <svg
          width={canvasW}
          height={canvasH}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          role="img"
          aria-label={`${view.label} ${shapes
            .map(
              (shape) =>
                `${shape.caption} ${shape.dimension[view.x]} × ${shape.dimension[view.y]} mm`,
            )
            .join(", ")}`}
        >
          {drawOrder.map((shape) => {
            const tone = sizeTone(shape.tone);
            const state = emphasis(shape);
            const w = Math.max(shape.dimension[view.x] * pxPerMm, 1);
            const h = Math.max(shape.dimension[view.y] * pxPerMm, 1);
            // Bottom-aligned and horizontally centred, so overlaid shapes share a baseline.
            return (
              <rect
                key={shape.key}
                x={(canvasW - w) / 2}
                y={canvasH - 1 - h}
                width={w}
                height={h}
                rx={Math.min(w, h) * 0.12}
                strokeWidth={state === "strong" ? 2 : 1.5}
                strokeDasharray={shape.dashed ? "4 3" : undefined}
                className={`transition-opacity ${tone.stroke} ${
                  state === "strong"
                    ? tone.fillStrong
                    : state === "dim"
                      ? "fill-transparent opacity-40"
                      : tone.fill
                }`}
              />
            );
          })}
        </svg>
      </div>
      <figcaption className="text-center text-xs leading-5 tabular-nums">
        {shapes.map((shape) => (
          <span
            key={shape.key}
            className={`block whitespace-nowrap transition-opacity ${sizeTone(shape.tone).text} ${
              emphasis(shape) === "dim" ? "opacity-50" : ""
            } ${emphasis(shape) === "strong" ? "font-semibold" : ""}`}
          >
            {shape.caption ? `${shape.caption} ` : null}
            {shape.dimension[view.x]} × {shape.dimension[view.y]} mm
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

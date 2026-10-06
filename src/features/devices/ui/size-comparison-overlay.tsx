"use client";

import { useState } from "react";

import type { Device } from "../model/device";
import {
  comparisonSizeShapes,
  SizeFigure,
  sizeTone,
  sizeViews,
} from "./size-comparison";

// Comparison 크기 views with every device overlaid. Clicking a device name in
// the legend brings that device to the front; the first device starts there.
export function ComparisonSizeOverlay({
  devices,
}: {
  devices: readonly Device[];
}) {
  const shapes = comparisonSizeShapes(devices);
  const [highlight, setHighlight] = useState(
    () =>
      devices.find((device) => device.dimensions?.length)?.slug ??
      devices[0].slug,
  );

  return (
    <>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-12">
        {sizeViews.map((view) => (
          <SizeFigure
            key={view.key}
            shapes={shapes}
            view={view}
            title
            highlight={highlight}
          />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs font-medium">
        {devices.map((device, index) => {
          const hasSize = Boolean(device.dimensions?.length);
          const selected = device.slug === highlight;
          return (
            <button
              key={device.slug}
              type="button"
              disabled={!hasSize}
              aria-pressed={selected}
              onClick={() => setHighlight(device.slug)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${sizeTone(index).text} ${
                selected
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "opacity-60 hover:opacity-100 disabled:cursor-not-allowed disabled:hover:opacity-60"
              }`}
            >
              <span
                aria-hidden
                className={`inline-block h-2.5 w-3.5 rounded-sm border-[1.5px] border-current ${
                  selected ? "bg-current/25" : ""
                }`}
              />
              {device.name}
              {hasSize ? null : " (크기 정보 없음)"}
            </button>
          );
        })}
      </div>
    </>
  );
}

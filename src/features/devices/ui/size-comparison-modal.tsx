"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { Device } from "../model/device";
import {
  comparisonSizeShapes,
  deviceSizeShapes,
  SizeFigure,
  sizeTone,
  sizeViews,
} from "./size-comparison";

// Thumbnail height of the tallest compared device; the others shrink with it
// so the thumbnails already compare at true ratio.
const THUMB_PX = 40;

// Front silhouette in the 크기 row. Clicking it opens the full front / side /
// top drawing in a modal, with this device highlighted in a comparison.
export function SizeThumbnailButton({
  devices,
  index,
  align = "left",
}: {
  devices: readonly Device[];
  index: number;
  align?: "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const device = devices[index];
  const dimensions = device.dimensions ?? [];
  if (dimensions.length === 0) return null;

  const comparison = devices.length > 1;
  const tallest = Math.max(
    ...devices.flatMap((item) =>
      (item.dimensions ?? []).map((d) => d.heightMm),
    ),
  );
  const pxPerMm = THUMB_PX / tallest;
  const width = Math.max(...dimensions.map((d) => d.widthMm)) * pxPerMm + 2;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className={`mt-2 flex items-end gap-2 rounded-control p-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${
          align === "right" ? "ml-auto flex-row-reverse" : ""
        }`}
      >
        <svg
          aria-hidden
          width={width}
          height={THUMB_PX + 2}
          viewBox={`0 0 ${width} ${THUMB_PX + 2}`}
        >
          {dimensions.map((dimension, entry) => {
            const tone = sizeTone(comparison ? index : entry);
            const w = dimension.widthMm * pxPerMm;
            const h = dimension.heightMm * pxPerMm;
            return (
              <rect
                key={entry}
                x={(width - w) / 2}
                y={THUMB_PX + 1 - h}
                width={w}
                height={h}
                rx={Math.min(w, h) * 0.12}
                strokeWidth={1.25}
                strokeDasharray={entry > 0 ? "3 2" : undefined}
                className={`${tone.stroke} ${tone.fill}`}
              />
            );
          })}
        </svg>
        <span className="whitespace-nowrap">
          크기 비교
        </span>
      </button>
      {isOpen ? (
        <SizeModal
          devices={devices}
          initialHighlight={device.slug}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}

function SizeModal({
  devices,
  initialHighlight,
  onClose,
}: {
  devices: readonly Device[];
  initialHighlight: string;
  onClose: () => void;
}) {
  const comparison = devices.length > 1;
  const shapes = comparison
    ? comparisonSizeShapes(devices)
    : deviceSizeShapes(devices[0]);
  const [highlight, setHighlight] = useState(initialHighlight);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="presentation"
      onMouseDown={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/45 backdrop-blur-sm sm:items-center sm:px-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-sheet border border-zinc-200 bg-white shadow-2xl sm:rounded-sheet dark:border-zinc-700 dark:bg-zinc-950"
      >
        <header className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <div>
            <h2
              id="size-modal-title"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {comparison ? "크기 비교" : `${devices[0].name} 크기`}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              같은 비율로 그린 정면·측면·상단 크기
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-control p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="size-5"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
          <div className="flex flex-wrap items-start justify-center gap-x-12 gap-y-8">
            {sizeViews.map((view) => (
              <SizeFigure
                key={view.key}
                shapes={shapes}
                view={view}
                title
                highlight={comparison ? highlight : undefined}
              />
            ))}
          </div>
          {comparison ? (
            <div className="mt-6 flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs font-medium">
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
          ) : null}
        </div>
      </section>
    </div>,
    document.body,
  );
}

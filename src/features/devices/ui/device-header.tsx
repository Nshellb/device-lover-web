"use client";

import { useState } from "react";

import type { Device, DeviceColor } from "../model/device";

// Plain <img>, not next/image: a selected color's imageUrl is admin-entered
// in the BO with no host restriction (no upload pipeline — see BO's device
// form), so it won't generally match next.config.ts's images.remotePatterns
// allowlist (currently just Samsung/Apple's own CDN paths).
function DeviceVisual({
  device,
  imageUrl,
  alt,
}: {
  device: Device;
  imageUrl: string | null;
  alt: string;
}) {
  // Keyed by URL rather than a boolean so picking another color (a different
  // imageUrl) gets a fresh attempt instead of inheriting the earlier failure.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!imageUrl || failedUrl === imageUrl) {
    if (device.category === "camera") {
      return (
        <div
          aria-hidden="true"
          data-device-visual
          className="grid h-24 w-36 shrink-0 place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500"
        >
          <svg
            viewBox="0 0 48 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-10 w-14"
          >
            <path d="M5 11h9l3-5h14l3 5h9a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3Z" />
            <circle cx="24" cy="22" r="8" />
          </svg>
        </div>
      );
    }
    return (
      <div
        aria-hidden="true"
        data-device-visual
        className="h-36 w-24 shrink-0 rounded-md border border-dashed border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={alt}
      data-device-visual
      width={96}
      height={144}
      className="h-36 w-24 shrink-0 rounded-xl border border-zinc-200 bg-white object-contain p-1 dark:border-zinc-700"
      onError={() => setFailedUrl(imageUrl)}
    />
  );
}

function ColorPicker({
  colors,
  selectedId,
  onSelect,
  align,
}: {
  colors: readonly DeviceColor[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  align: "left" | "right";
}) {
  if (colors.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="색상 선택"
      className={`mt-2 flex flex-wrap gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}
    >
      {colors.map((color) => {
        const isSelected = color.id === selectedId;
        const label = color.exclusive
          ? `${color.name} (단독 색상)`
          : color.name;

        if (color.colorCode) {
          return (
            <button
              key={color.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={label}
              title={label}
              onClick={() => onSelect(color.id)}
              className={`h-6 w-6 shrink-0 rounded-full transition-shadow ${
                isSelected
                  ? "ring-2 ring-brand ring-offset-2 ring-offset-white dark:ring-offset-zinc-950"
                  : "ring-1 ring-inset ring-black/10 hover:ring-black/25 dark:ring-white/15 dark:hover:ring-white/30"
              }`}
              style={{ backgroundColor: color.colorCode }}
            />
          );
        }

        return (
          <button
            key={color.id}
            type="button"
            aria-pressed={isSelected}
            title={label}
            onClick={() => onSelect(color.id)}
            className={`max-w-24 truncate rounded-full border px-2 py-1 text-[11px] font-medium transition-colors ${
              isSelected
                ? "border-brand bg-brand text-white"
                : "border-zinc-300 text-zinc-600 hover:border-brand/40 hover:text-brand dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-blue-300"
            }`}
          >
            {color.name}
          </button>
        );
      })}
    </div>
  );
}

export function DeviceHeader({
  device,
  placement,
}: {
  device: Device;
  placement: "single" | "left" | "right";
}) {
  const placementClasses = {
    single:
      "flex-col items-start sm:flex-row sm:items-end sm:justify-start sm:gap-5",
    left: "flex-col items-end sm:flex-row sm:items-end sm:justify-end sm:gap-5",
    right:
      "flex-col items-start sm:flex-row-reverse sm:items-end sm:justify-end sm:gap-5",
  }[placement];
  const textAlignment = placement === "left" ? "text-right" : "text-left";
  const brandColor =
    device.visual === "camera"
      ? "text-amber-700 dark:text-amber-400"
      : device.visual === "galaxy"
        ? "text-brand dark:text-blue-400"
        : device.visual === "iphone"
          ? "text-rose-700 dark:text-rose-400"
          : "text-zinc-700 dark:text-zinc-300";
  const modelNumbers = device.modelNumbers.map((value) => value.toUpperCase());
  // A color only changes the picture when it has its own image, so colors without
  // one aren't offered (and the picker disappears when none has an image).
  const imageColors = device.colors.filter((color) => color.imageUrl);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    () => imageColors[0]?.id ?? null,
  );
  const selectedColor = imageColors.find(
    (color) => color.id === selectedColorId,
  );
  const activeImageUrl = selectedColor?.imageUrl ?? device.imageUrl;
  const pickerAlign = placement === "left" ? "right" : "left";

  return (
    <div data-device-header className={`flex gap-4 ${placementClasses}`}>
      <DeviceVisual
        device={device}
        imageUrl={activeImageUrl}
        alt={
          selectedColor?.imageUrl
            ? `${device.name} ${selectedColor.name}`
            : (device.imageAlt ?? device.name)
        }
      />
      <div className={`pb-1 ${textAlignment}`}>
        <p
          className={`text-[11px] font-semibold tracking-[0.14em] ${brandColor}`}
        >
          {device.brand}
        </p>
        <p className="mt-1 max-w-44 text-xl font-bold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
          {device.name}
        </p>
        {modelNumbers.length > 0 ? (
          <p className="mt-1 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
            모델 번호 {modelNumbers.join(", ")}
          </p>
        ) : null}
        <p className="mt-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
          {device.variant}
        </p>
        <ColorPicker
          colors={imageColors}
          selectedId={selectedColorId}
          onSelect={setSelectedColorId}
          align={pickerAlign}
        />
      </div>
    </div>
  );
}

import Image from "next/image";

import type { Device } from "../model/device";

function DeviceVisual({ device }: { device: Device }) {
  if (!device.imageUrl) {
    if (device.category === "camera") {
      return (
        <div
          aria-hidden="true"
          data-device-visual
          className="grid h-24 w-36 shrink-0 place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500"
        >
          <svg viewBox="0 0 48 36" fill="none" stroke="currentColor" strokeWidth="2" className="h-10 w-14">
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
        className="h-36 w-[72px] shrink-0 rounded-md border border-dashed border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60"
      />
    );
  }

  return (
    <Image
      src={device.imageUrl}
      alt=""
      data-device-visual
      width={72}
      height={144}
      sizes="72px"
      className="h-36 w-[72px] shrink-0 object-contain"
    />
  );
}

function getModelNumbers(aliases: readonly string[]): string[] {
  return aliases.flatMap((alias) => {
    if (/^(?:sm-[a-z0-9]+|a\d{4,})$/i.test(alias)) {
      return [alias.toUpperCase()];
    }

    if (/^iphone\d+,\d+$/i.test(alias)) {
      return [alias.replace(/^iphone/i, "iPhone")];
    }

    return [];
  });
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
    left:
      "flex-col items-end sm:flex-row sm:items-end sm:justify-end sm:gap-5",
    right:
      "flex-col items-start sm:flex-row-reverse sm:items-end sm:justify-end sm:gap-5",
  }[placement];
  const textAlignment = placement === "left" ? "text-right" : "text-left";
  const brandColor =
    device.visual === "camera"
      ? "text-amber-700 dark:text-amber-400"
      : device.visual === "galaxy"
      ? "text-brand dark:text-blue-400"
      : "text-rose-700 dark:text-rose-400";
  const modelNumbers = getModelNumbers(device.aliases);

  return (
    <div data-device-header className={`flex gap-4 ${placementClasses}`}>
      <DeviceVisual device={device} />
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
      </div>
    </div>
  );
}

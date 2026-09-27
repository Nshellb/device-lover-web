"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ComparisonListBar } from "@/features/devices/ui/comparison-list-bar";
import { DeviceSearch } from "@/features/devices/ui/device-search";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { useSelectedDevices } from "@/features/devices/model/use-selected-devices";
import type { DeviceSearchItem } from "@/features/devices/model/device";

export function SiteHeaderControls({
  defaultDevices,
  brand,
}: {
  defaultDevices: DeviceSearchItem[];
  brand: ReactNode;
}) {
  // Resolved once here and passed down, so DeviceSearch and ComparisonListBar
  // don't each independently call GET /api/comparisons for the same pathname.
  const pathname = usePathname();
  const selectedDevices = useSelectedDevices(pathname, defaultDevices);

  return (
    <>
      <header data-site-header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
          {brand}

          <div className="ml-auto flex items-center gap-2">
            <DeviceSearch selectedDevices={selectedDevices} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <ComparisonListBar selectedDevices={selectedDevices} />
    </>
  );
}

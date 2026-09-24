"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ComparisonListBar } from "@/components/layout/comparison-list-bar";
import { DeviceSearch } from "@/components/search/device-search";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useSelectedDevices } from "@/lib/use-selected-devices";
import type { DeviceSearchItem } from "@/lib/device-search";

export function SiteHeaderControls({
  defaultDevices,
}: {
  defaultDevices: DeviceSearchItem[];
}) {
  // Resolved once here and passed down, so DeviceSearch and ComparisonListBar
  // don't each independently call GET /api/comparisons for the same pathname.
  const pathname = usePathname();
  const selectedDevices = useSelectedDevices(pathname, defaultDevices);

  return (
    <>
      <header data-site-header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            aria-label="Device Lover 홈"
          >
            <Image
              src="/device-lover-logo.svg"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              priority
              className="size-10"
            />
            <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Device Lover
            </span>
          </Link>

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

import Image from "next/image";
import Link from "next/link";

import { getHome } from "@/server/devices/api";
import { toDeviceSearchItem } from "@/features/devices/api/adapters";
import type { DeviceSearchItem } from "@/features/devices/model/device";

import { SiteHeaderControls } from "./site-header-controls";

async function getDefaultDevices(): Promise<DeviceSearchItem[]> {
  try {
    const home = await getHome();
    return home.devices.map(toDeviceSearchItem);
  } catch {
    // The header renders on every page, including ones that don't depend on
    // this — degrade to "nothing selected by default" instead of a 500.
    return [];
  }
}

export async function SiteHeader() {
  const defaultDevices = await getDefaultDevices();

  return (
    <SiteHeaderControls
      defaultDevices={defaultDevices}
      brand={
        <Link
          href="/"
          className="flex items-center gap-3 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          aria-label="Device Lover 홈"
        >
          <Image
            src="/device-lover-logo.svg"
            alt=""
            aria-hidden="true"
            width={657}
            height={726}
            priority
            className="h-6 w-auto"
          />
          <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Device Lover
          </span>
        </Link>
      }
    />
  );
}

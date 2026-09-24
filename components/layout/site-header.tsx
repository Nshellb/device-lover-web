import { SiteHeaderControls } from "@/components/layout/site-header-controls";
import { getHome } from "@/lib/api/client";
import { toDeviceSearchItem } from "@/lib/api/adapters";
import type { DeviceSearchItem } from "@/lib/device-search";

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

  return <SiteHeaderControls defaultDevices={defaultDevices} />;
}

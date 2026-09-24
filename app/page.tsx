import type { Metadata } from "next";

import { DeviceSpecificationPage } from "@/components/device/device-specification-page";
import { getHome } from "@/lib/api/client";
import { toDevice } from "@/lib/api/adapters";

async function getLatestDevices() {
  const home = await getHome();
  return home.devices.map(toDevice);
}

export async function generateMetadata(): Promise<Metadata> {
  const devices = await getLatestDevices();

  if (devices.length === 0) {
    return {
      title: "Device Lover",
      description: "스마트폰과 카메라 등 전자기기의 사양을 한눈에 비교하세요.",
    };
  }

  const deviceNames = devices.map((device) => device.name).join(" vs ");

  return {
    title: `${deviceNames} 비교`,
    description: `${deviceNames}, 가장 최근에 출시된 스마트폰의 주요 사양을 비교합니다.`,
  };
}

export default async function Home() {
  const devices = await getLatestDevices();

  if (devices.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-24 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          아직 등록된 기기가 없습니다. 잠시 후 다시 확인해주세요.
        </p>
      </main>
    );
  }

  return <DeviceSpecificationPage devices={devices} latest />;
}

import type { Metadata } from "next";

import { DeviceSpecificationPage } from "@/features/devices/ui/device-specification-page";
import { loadDevices } from "./_lib/load-devices";

type ComparisonPageProps = {
  params: Promise<{ comparison: string }>;
};

export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { comparison } = await params;
  const devices = await loadDevices(comparison);

  const deviceNames = devices.map((device) => device.name).join(" vs ");

  return {
    title:
      devices.length === 2
        ? `${deviceNames} 비교`
        : `${deviceNames} 사양`,
    description:
      devices.length === 2
        ? `${deviceNames}의 주요 사양을 한눈에 비교합니다.`
        : `${deviceNames}의 주요 사양을 한눈에 확인합니다.`,
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { comparison } = await params;
  const devices = await loadDevices(comparison);

  return <DeviceSpecificationPage devices={devices} />;
}

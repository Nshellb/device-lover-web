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

  const isComparison = devices.length >= 2;
  const title = isComparison
    ? `${deviceNames} 스펙 비교`
    : `${deviceNames} 스펙`;
  const description = isComparison
    ? `${deviceNames}의 디자인, 성능, 카메라, 배터리 등 주요 사양과 차이점을 표로 한눈에 비교합니다.`
    : `${deviceNames}의 디자인, 성능, 카메라, 배터리 등 주요 사양을 한눈에 확인합니다.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { comparison } = await params;
  const devices = await loadDevices(comparison);

  return <DeviceSpecificationPage devices={devices} />;
}

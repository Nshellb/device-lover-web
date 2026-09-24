import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeviceSpecificationPage } from "@/components/device/device-specification-page";
import { getCameraComparison, getComparison } from "@/lib/api/client";
import { toCamera, toDevice } from "@/lib/api/adapters";

type ComparisonPageProps = {
  params: Promise<{ comparison: string }>;
};

function parseIdentifiers(segment: string): string[] | null {
  const identifiers = segment.split(/-vs-/i);

  if (
    identifiers.length < 1 ||
    identifiers.length > 3 ||
    identifiers.some((identifier) => identifier.length === 0)
  ) {
    return null;
  }

  return identifiers;
}

async function loadDevices(comparison: string) {
  const identifiers = parseIdentifiers(comparison);

  if (!identifiers) {
    notFound();
  }

  // Resolves by slug, display name, alias, or model number — the API
  // normalizes and matches all of them against the same identifier registry.
  const smartphoneResponse = await getComparison(identifiers);

  if (smartphoneResponse) {
    return smartphoneResponse.devices.map(toDevice);
  }

  const cameraResponse = await getCameraComparison(identifiers);
  if (cameraResponse) {
    return cameraResponse.devices.map(toCamera);
  }

  notFound();
}

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

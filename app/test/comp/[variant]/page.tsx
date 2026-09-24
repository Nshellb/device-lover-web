import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ComparisonConcepts,
  type ConceptDevice,
} from "@/components/device/comparison-concepts";
import { getAllDevices, getLatestReleasedDevicePair } from "@/data/devices";

type ConceptVariant = "1" | "2" | "3";
type ConceptPageProps = {
  params: Promise<{ variant: string }>;
};

const variantTitles: Record<ConceptVariant, string> = {
  "1": "카드형 선택 목록",
  "2": "압축형 선택 바",
  "3": "탐색·선택 분할 화면",
};

function isConceptVariant(value: string): value is ConceptVariant {
  return value === "1" || value === "2" || value === "3";
}

export function generateStaticParams() {
  return [{ variant: "1" }, { variant: "2" }, { variant: "3" }];
}

export async function generateMetadata({
  params,
}: ConceptPageProps): Promise<Metadata> {
  const { variant } = await params;

  if (!isConceptVariant(variant)) {
    notFound();
  }

  return {
    title: `비교 목록 시안 ${variant} · ${variantTitles[variant]}`,
    description: "Device Lover 기기 비교 목록 인터페이스 시안입니다.",
    robots: { index: false, follow: false },
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { variant } = await params;

  if (!isConceptVariant(variant)) {
    notFound();
  }

  const catalog: ConceptDevice[] = getAllDevices().map((device) => ({
    slug: device.slug,
    name: device.name,
    brand: device.brand,
    variant: device.variant,
    releaseDate: device.releaseDate,
    imageUrl: device.imageUrl ?? "",
    aliases: device.aliases,
    display: device.specs.displaySize.value,
    processor: device.specs.processor.value,
    camera: device.specs.rearCameras.value,
  }));

  return (
    <ComparisonConcepts
      variant={variant}
      catalog={catalog}
      initialSlugs={getLatestReleasedDevicePair().map((device) => device.slug)}
    />
  );
}

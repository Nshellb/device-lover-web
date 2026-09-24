import type { Metadata } from "next";

import { DeviceSpecificationPage } from "@/components/device/device-specification-page";
import { getLatestReleasedDevicePair } from "@/data/devices";

export const metadata: Metadata = {
  title: "글래스 UI 시안",
  description: "Device Lover의 글래스 UI 적용 시안입니다.",
  robots: { index: false, follow: false },
};

export default function GlassPreviewPage() {
  return (
    <div data-glass-preview className="glass-preview-surface flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6">
        <p className="inline-flex rounded-full border border-brand/20 bg-white/75 px-3 py-1.5 text-xs font-semibold text-brand shadow-sm backdrop-blur-sm dark:border-blue-400/20 dark:bg-zinc-900/70 dark:text-blue-300">
          글래스 UI 시안 · 헤더, 비교 목록, 검색 패널
        </p>
      </div>
      <DeviceSpecificationPage devices={getLatestReleasedDevicePair()} latest />
    </div>
  );
}

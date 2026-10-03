"use client";

import { useState, type ReactNode } from "react";

type ComparisonLayout = "scroll" | "fit";

export function ComparisonWorkspace({
  children,
  deviceCount,
  deviceSlugs,
  labelledBy,
}: {
  children: ReactNode;
  deviceCount: number;
  deviceSlugs: string;
  labelledBy: string;
}) {
  const [layout, setLayout] = useState<ComparisonLayout>("scroll");
  const hasThirdDevice = deviceCount === 3;
  const effectiveLayout = hasThirdDevice ? layout : "scroll";

  return (
    <div>
      {hasThirdDevice ? (
        <div className="mb-3 flex justify-end">
          <div
            role="group"
            aria-label="비교표 레이아웃"
            className="inline-flex rounded-full border border-zinc-300 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <button
              type="button"
              aria-pressed={layout === "scroll"}
              onClick={() => setLayout("scroll")}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                layout === "scroll"
                  ? "bg-brand text-white"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              좌우 스크롤
            </button>
            <button
              type="button"
              aria-pressed={layout === "fit"}
              onClick={() => setLayout("fit")}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                layout === "fit"
                  ? "bg-brand text-white"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              한 화면
            </button>
          </div>
        </div>
      ) : null}

      <div
        id="comparison-table"
        role="region"
        aria-labelledby={labelledBy}
        tabIndex={0}
        data-device-slugs={deviceSlugs}
        data-layout={effectiveLayout}
        className="comparison-frame comparison-table-transition overflow-x-auto rounded-surface border border-zinc-200 bg-white outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950"
      >
        {children}
      </div>
    </div>
  );
}

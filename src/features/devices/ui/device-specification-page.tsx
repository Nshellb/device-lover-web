import type { Device } from "../model/device";
import { ComparisonWorkspace } from "./comparison-workspace";
import {
  ComparisonTable,
  SingleDeviceTable,
  type ComparisonDevices,
} from "./specification-tables";

export function DeviceSpecificationPage({
  devices,
  latest = false,
}: {
  devices: Device[];
  latest?: boolean;
}) {
  const isComparison = devices.length >= 2;
  const heading = isComparison
    ? devices.map((device) => device.name).join(" vs ")
    : devices[0].name;
  const comparisonDevices = isComparison
    ? (devices as ComparisonDevices)
    : null;
  const deviceSlugs = devices.map((device) => device.slug).join("|");

  return (
    <main data-spec-page className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      <section data-spec-intro className="border-b border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 sm:px-6 sm:py-4">
          <h1
            id="specification-title"
            className="text-xl font-bold tracking-[-0.025em] text-zinc-950 sm:text-2xl dark:text-zinc-50"
          >
            {heading}
          </h1>
          {latest ? (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand dark:bg-brand/20 dark:text-blue-300">
              최신 기기
            </span>
          ) : null}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isComparison ? "핵심 사양 비교" : "주요 사양"}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="specification-title"
        className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6"
      >
        {comparisonDevices ? (
          <ComparisonWorkspace
            deviceCount={devices.length}
            deviceSlugs={deviceSlugs}
            labelledBy="specification-title"
          >
            <ComparisonTable devices={comparisonDevices} />
          </ComparisonWorkspace>
        ) : (
          <div
            id="comparison-table"
            role="region"
            aria-labelledby="specification-title"
            tabIndex={0}
            data-device-slugs={deviceSlugs}
            className="comparison-table-transition overflow-x-auto rounded-surface border border-zinc-200 bg-white outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950"
          >
            <SingleDeviceTable device={devices[0]} />
          </div>
        )}

        <div className="mt-5 rounded-surface border border-zinc-200 bg-white px-5 py-4 text-xs leading-5 text-zinc-500 sm:flex sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <p>표시된 정보는 제조사 공식 사양을 기준으로 정리했습니다.</p>
          <div className="mt-2 flex flex-wrap gap-4 font-medium sm:mt-0 sm:pl-6">
            {devices.map((device) => (
              <a
                key={device.slug}
                href={device.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-brand focus-visible:text-brand dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-blue-400 dark:focus-visible:text-blue-400"
              >
                {device.name} 출처
              </a>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-zinc-600 dark:text-zinc-400">
          {devices[0].category === "camera"
            ? "출시월은 일본 출시 기준이며, 무게는 배터리·메모리 카드·렌즈를 제외한 본체 기준입니다."
            : "지역과 저장 용량에 따라 제공 사양이 달라질 수 있습니다. 배터리 재생·충전 시간은 각 제조사의 서로 다른 시험 조건으로 측정된 값입니다."}
        </p>
      </section>
    </main>
  );
}

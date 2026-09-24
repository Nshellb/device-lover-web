import Image from "next/image";

import { ComparisonWorkspace } from "@/components/device/comparison-workspace";
import {
  cameraSpecificationSections,
  specificationSections,
  type Device,
  type SpecValue,
} from "@/data/devices";

function getSpecificationValue(
  device: Device,
  key: string,
  isBasicInformation: boolean,
): SpecValue {
  if (key === "releaseDate") {
    const [year, month, day] = device.releaseDate.split("-");

    return {
      value:
        device.category === "camera"
          ? `${year}년 ${Number(month)}월`
          : `${year}년 ${Number(month)}월 ${Number(day)}일`,
    };
  }

  const value = device.specs[key] ?? { value: "정보 없음", muted: true };

  if (!isBasicInformation || device.category !== "smartphone") return value;

  if (key === "memory") {
    return {
      value: `RAM ${value.value}`,
      detail: `내장메모리 ${device.specs.storage.value}${
        value.detail ? ` · RAM ${value.detail}` : ""
      }`,
      muted: value.muted,
    };
  }

  if (key === "displaySize") {
    const inches = value.detail?.match(/(\d+(?:\.\d+)?)형/)?.[1];
    const metricSize = value.value.match(/^(\d+(?:\.\d+)?)\s*(mm|cm)$/);
    const millimetres = metricSize
      ? `${
          metricSize[2] === "cm"
            ? Number(metricSize[1]) * 10
            : metricSize[1]
        }mm`
      : value.value;
    const resolution = device.specs.displayResolution.value;
    const pixels = resolution.match(/(\d+)\s*×\s*(\d+)/);
    const aspectRatio = pixels
      ? Math.round((Number(pixels[1]) / Number(pixels[2])) * 18) / 2
      : null;
    const stylus = device.specs.stylus.value;

    return {
      value: inches
        ? `${value.detail?.startsWith("약") ? "약 " : ""}${inches}인치 (${millimetres})`
        : value.value,
      detail: [
        aspectRatio ? `약 ${aspectRatio}:9 비율` : null,
        `${resolution} 픽셀`,
        stylus === "미지원" ? null : `펜 지원 (${stylus})`,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  }

  return value;
}

function DeviceVisual({ device }: { device: Device }) {
  if (!device.imageUrl) {
    if (device.category === "camera") {
      return (
        <div
          aria-hidden="true"
          data-device-visual
          className="grid h-24 w-36 shrink-0 place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500"
        >
          <svg viewBox="0 0 48 36" fill="none" stroke="currentColor" strokeWidth="2" className="h-10 w-14">
            <path d="M5 11h9l3-5h14l3 5h9a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3Z" />
            <circle cx="24" cy="22" r="8" />
          </svg>
        </div>
      );
    }
    return (
      <div
        aria-hidden="true"
        data-device-visual
        className="h-36 w-[72px] shrink-0 rounded-md border border-dashed border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60"
      />
    );
  }

  return (
    <Image
      src={device.imageUrl}
      alt=""
      data-device-visual
      width={72}
      height={144}
      sizes="72px"
      className="h-36 w-[72px] shrink-0 object-contain"
    />
  );
}

function getModelNumbers(aliases: readonly string[]): string[] {
  return aliases.flatMap((alias) => {
    if (/^(?:sm-[a-z0-9]+|a\d{4,})$/i.test(alias)) {
      return [alias.toUpperCase()];
    }

    if (/^iphone\d+,\d+$/i.test(alias)) {
      return [alias.replace(/^iphone/i, "iPhone")];
    }

    return [];
  });
}

function DeviceHeader({
  device,
  placement,
}: {
  device: Device;
  placement: "single" | "left" | "right";
}) {
  const placementClasses = {
    single:
      "flex-col items-start sm:flex-row sm:items-end sm:justify-start sm:gap-5",
    left:
      "flex-col items-end sm:flex-row sm:items-end sm:justify-end sm:gap-5",
    right:
      "flex-col items-start sm:flex-row-reverse sm:items-end sm:justify-end sm:gap-5",
  }[placement];
  const textAlignment = placement === "left" ? "text-right" : "text-left";
  const brandColor =
    device.visual === "camera"
      ? "text-amber-700 dark:text-amber-400"
      : device.visual === "galaxy"
      ? "text-brand dark:text-blue-400"
      : "text-rose-700 dark:text-rose-400";
  const modelNumbers = getModelNumbers(device.aliases);

  return (
    <div data-device-header className={`flex gap-4 ${placementClasses}`}>
      <DeviceVisual device={device} />
      <div className={`pb-1 ${textAlignment}`}>
        <p
          className={`text-[11px] font-semibold tracking-[0.14em] ${brandColor}`}
        >
          {device.brand}
        </p>
        <p className="mt-1 max-w-44 text-xl font-bold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
          {device.name}
        </p>
        {modelNumbers.length > 0 ? (
          <p className="mt-1 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
            모델 번호 {modelNumbers.join(" · ")}
          </p>
        ) : null}
        <p className="mt-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
          {device.variant}
        </p>
      </div>
    </div>
  );
}

function SpecCell({
  value,
  align = "left",
}: {
  value: SpecValue;
  align?: "left" | "right";
}) {
  return (
    <td
      className={`px-5 py-4 align-middle sm:px-7 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <p
        className={
          value.muted
            ? "font-medium text-zinc-500 dark:text-zinc-400"
            : "font-medium text-zinc-900 dark:text-zinc-100"
        }
      >
        {value.value}
      </p>
      {value.detail ? (
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {value.detail}
        </p>
      ) : null}
    </td>
  );
}

function SectionHeader({
  title,
  description,
  columnCount,
}: {
  title: string;
  description: string;
  columnCount: 2 | 3 | 4;
}) {
  return (
    <tr>
      <th
        scope="rowgroup"
        colSpan={columnCount}
        className="border-y border-zinc-200 bg-zinc-100/80 px-5 py-3 text-center dark:border-zinc-800 dark:bg-zinc-800/70"
      >
        <span className="text-xs font-bold tracking-[0.08em] text-zinc-800 dark:text-zinc-200">
          {title}
        </span>
        <span className="ml-3 text-xs font-normal tracking-normal text-zinc-500 dark:text-zinc-400">
          {description}
        </span>
      </th>
    </tr>
  );
}

function SingleDeviceTable({ device }: { device: Device }) {
  const sections =
    device.category === "camera" ? cameraSpecificationSections : specificationSections;

  return (
    <table className="w-full min-w-[360px] table-fixed border-collapse text-left text-sm">
      <caption className="sr-only">{device.name} 상세 사양</caption>
      <colgroup>
        <col className="w-32 sm:w-52" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th
            scope="col"
            className="border-r border-zinc-200 bg-zinc-50 px-5 py-6 align-bottom text-xs font-semibold tracking-[0.14em] text-zinc-500 sm:px-7 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400"
          >
            SPEC
          </th>
          <th scope="col" className="px-5 py-7 align-bottom sm:px-7">
            <DeviceHeader device={device} placement="single" />
          </th>
        </tr>
      </thead>
      {sections.map((section) => (
        <tbody key={section.title}>
          <SectionHeader
            title={section.title}
            description={section.description}
            columnCount={2}
          />
          {section.rows.map((row) => (
            <tr
              key={row.key}
              className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/80 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30"
            >
              <th
                scope="row"
                className="border-r border-zinc-200 bg-zinc-50 px-5 py-4 align-middle font-medium text-zinc-600 sm:px-7 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300"
              >
                {row.label}
              </th>
              <SpecCell
                value={getSpecificationValue(
                  device,
                  row.key,
                  section.title === "기본 정보",
                )}
              />
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

type ComparisonDevices =
  | [Device, Device]
  | [Device, Device, Device];

function ComparisonTable({ devices }: { devices: ComparisonDevices }) {
  const [leftDevice, ...rightDevices] = devices;
  const columnCount = (devices.length + 1) as 3 | 4;
  const sections =
    leftDevice.category === "camera" ? cameraSpecificationSections : specificationSections;

  return (
    <table
      className="w-full table-fixed border-collapse text-left text-sm"
      style={{ minWidth: devices.length === 3 ? "960px" : "760px" }}
    >
      <caption className="sr-only">
        {devices.map((device) => device.name).join(", ")} 사양 비교
      </caption>
      <colgroup>
        <col />
        <col data-spec-column className="w-32 sm:w-44" />
        {rightDevices.map((device) => (
          <col key={device.slug} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th scope="col" className="px-5 py-7 align-bottom sm:px-7">
            <DeviceHeader device={leftDevice} placement="left" />
          </th>
          <th
            scope="col"
            className="border-x border-zinc-200 bg-zinc-50 px-4 py-6 text-center align-bottom text-xs font-semibold tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400"
          >
            SPEC
          </th>
          {rightDevices.map((device) => (
            <th
              key={device.slug}
              scope="col"
              className="px-5 py-7 align-bottom sm:px-7"
            >
              <DeviceHeader device={device} placement="right" />
            </th>
          ))}
        </tr>
      </thead>
      {sections.map((section) => (
        <tbody key={section.title}>
          <SectionHeader
            title={section.title}
            description={section.description}
            columnCount={columnCount}
          />
          {section.rows.map((row) => (
            <tr
              key={row.key}
              className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/80 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30"
            >
              <SpecCell
                value={getSpecificationValue(
                  leftDevice,
                  row.key,
                  section.title === "기본 정보",
                )}
                align="right"
              />
              <th
                scope="row"
                className="border-x border-zinc-200 bg-zinc-50 px-4 py-4 text-center align-middle font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300"
              >
                {row.label}
              </th>
              {rightDevices.map((device) => (
                <SpecCell
                  key={device.slug}
                  value={getSpecificationValue(
                    device,
                    row.key,
                    section.title === "기본 정보",
                  )}
                />
              ))}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

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
            className="comparison-table-transition overflow-x-auto rounded-surface border border-zinc-200 bg-white shadow-[0_20px_60px_-36px_rgba(23,107,255,0.28)] outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:focus-visible:ring-offset-zinc-950"
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

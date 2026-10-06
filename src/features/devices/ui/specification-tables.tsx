import { Fragment } from "react";

import type { Device, SpecValue } from "../model/device";
import {
  cameraSpecificationSections,
  getSpecificationSections,
} from "../model/specification-sections";
import {
  getSpecificationValue,
  isSpecificationRowVisible,
} from "../model/specification-values";
import { DeviceHeader } from "./device-header";
import {
  deviceSizeShapes,
  hasSizeDrawing,
  SizeFigure,
  sizeViews,
} from "./size-comparison";
import { ComparisonSizeOverlay } from "./size-comparison-overlay";

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
      {value.blocks ? (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {value.blocks.map((block) => (
            <div key={block.label} className="py-2 first:pt-0 last:pb-0">
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {block.label}
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {block.value}
              </p>
              {block.detail ? (
                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {block.detail}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {value.value}
          </p>
          {value.detail ? (
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {value.detail}
            </p>
          ) : null}
        </>
      )}
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

const rowClass =
  "border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/80 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30";

// 크기 section right after 기본 정보: front / side / top outlines drawn from the
// numeric dimensions at one shared scale; a comparison overlays every device.
// From sm up the views sit in one row across the table and scroll sideways with
// it like the other sections. On mobile they stack, and the box is pinned to
// the scroll frame (`@container` on it) via sticky + 100cqw so the stack stays
// on screen while the table scrolls.
function SizeSection({
  devices,
  layout,
}: {
  devices: readonly Device[];
  layout: "single" | "comparison";
}) {
  const columnCount = (devices.length + 1) as 2 | 3 | 4;

  return (
    <tbody>
      <SectionHeader
        title="크기"
        description="같은 비율로 그린 정면·측면·상단 크기"
        columnCount={columnCount}
      />
      <tr className={rowClass}>
        <td colSpan={columnCount} className="p-0">
          <div className="sticky left-0 w-[100cqw] px-5 py-6 sm:static sm:w-auto sm:px-7">
            {layout === "single" ? (
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-12">
                {sizeViews.map((view) => (
                  <SizeFigure
                    key={view.key}
                    shapes={deviceSizeShapes(devices[0])}
                    view={view}
                    title
                  />
                ))}
              </div>
            ) : (
              <ComparisonSizeOverlay devices={devices} />
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export function SingleDeviceTable({ device }: { device: Device }) {
  const sections =
    device.category === "camera"
      ? cameraSpecificationSections
      : getSpecificationSections([device]);
  const showSize = device.category !== "camera" && hasSizeDrawing([device]);

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
            className="border-r border-zinc-200 bg-zinc-50 px-5 py-3 align-bottom text-xs font-semibold tracking-[0.14em] text-zinc-500 sm:px-7 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400"
          >
            SPEC
          </th>
          <th scope="col" className="px-5 py-3 align-bottom sm:px-7">
            <DeviceHeader device={device} placement="single" />
          </th>
        </tr>
      </thead>
      {sections.map((section) => (
        <Fragment key={section.title}>
          <tbody>
            <SectionHeader
              title={section.title}
              description={section.description}
              columnCount={2}
            />
            {section.rows
              .filter((row) => isSpecificationRowVisible([device], row.key))
              .map((row) => (
                <tr key={row.key} className={rowClass}>
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
          {showSize && section.title === "기본 정보" ? (
            <SizeSection devices={[device]} layout="single" />
          ) : null}
        </Fragment>
      ))}
    </table>
  );
}

export type ComparisonDevices = [Device, Device] | [Device, Device, Device];

export function ComparisonTable({ devices }: { devices: ComparisonDevices }) {
  const [leftDevice, ...rightDevices] = devices;
  const columnCount = (devices.length + 1) as 3 | 4;
  const sections =
    leftDevice.category === "camera"
      ? cameraSpecificationSections
      : getSpecificationSections(devices);
  const showSize = leftDevice.category !== "camera" && hasSizeDrawing(devices);

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
        <col data-spec-column className="w-24" />
        {rightDevices.map((device) => (
          <col key={device.slug} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th scope="col" className="px-5 py-3 align-bottom sm:px-7">
            <DeviceHeader device={leftDevice} placement="left" />
          </th>
          <th
            scope="col"
            className="border-x border-zinc-200 bg-zinc-50 px-2 py-3 text-center align-bottom text-xs font-semibold tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400"
          >
            SPEC
          </th>
          {rightDevices.map((device) => (
            <th
              key={device.slug}
              scope="col"
              className="px-5 py-3 align-bottom sm:px-7"
            >
              <DeviceHeader device={device} placement="right" />
            </th>
          ))}
        </tr>
      </thead>
      {sections.map((section) => (
        <Fragment key={section.title}>
          <tbody>
            <SectionHeader
              title={section.title}
              description={section.description}
              columnCount={columnCount}
            />
            {section.rows
              .filter((row) => isSpecificationRowVisible(devices, row.key))
              .map((row) => (
                <tr key={row.key} className={rowClass}>
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
                    className="border-x border-zinc-200 bg-zinc-50 px-2 py-4 text-center align-middle font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300"
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
          {showSize && section.title === "기본 정보" ? (
            <SizeSection devices={devices} layout="comparison" />
          ) : null}
        </Fragment>
      ))}
    </table>
  );
}

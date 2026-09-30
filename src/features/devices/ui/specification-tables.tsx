import type { Device, SpecValue } from "../model/device";
import {
  cameraSpecificationSections,
  specificationSections,
} from "../model/specification-sections";
import {
  getSpecificationValue,
  isSpecificationRowVisible,
} from "../model/specification-values";
import { DeviceHeader } from "./device-header";

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
      <p className="font-medium text-zinc-900 dark:text-zinc-100">
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

export function SingleDeviceTable({ device }: { device: Device }) {
  const sections =
    device.category === "camera"
      ? cameraSpecificationSections
      : specificationSections;

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
          {section.rows
            .filter((row) => isSpecificationRowVisible([device], row.key))
            .map((row) => (
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

export type ComparisonDevices = [Device, Device] | [Device, Device, Device];

export function ComparisonTable({ devices }: { devices: ComparisonDevices }) {
  const [leftDevice, ...rightDevices] = devices;
  const columnCount = (devices.length + 1) as 3 | 4;
  const sections =
    leftDevice.category === "camera"
      ? cameraSpecificationSections
      : specificationSections;

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
          {section.rows
            .filter((row) => isSpecificationRowVisible(devices, row.key))
            .map((row) => (
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

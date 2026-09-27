"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

export type ConceptDevice = {
  slug: string;
  name: string;
  brand: string;
  variant: string;
  releaseDate: string;
  imageUrl: string;
  aliases: readonly string[];
  display: string;
  processor: string;
  camera: string;
};

type ConceptVariant = "1" | "2" | "3";

const concepts: Record<
  ConceptVariant,
  { name: string; tagline: string; description: string }
> = {
  "1": {
    name: "카드형 선택 목록",
    tagline: "선택한 기기를 크게 보여주는 방식",
    description: "제품의 존재감과 비교 순서를 한눈에 볼 수 있습니다.",
  },
  "2": {
    name: "압축형 선택 바",
    tagline: "사양표에 집중하는 방식",
    description: "선택 목록의 높이를 줄여 비교 내용을 먼저 보여줍니다.",
  },
  "3": {
    name: "탐색·선택 분할 화면",
    tagline: "기기를 여러 번 바꿔가며 고르는 방식",
    description: "검색 결과와 비교 목록을 동시에 보며 기기를 조합합니다.",
  },
};

function DeviceArtwork({
  device,
  compact = false,
}: {
  device: ConceptDevice;
  compact?: boolean;
}) {
  return (
    <Image
      src={device.imageUrl}
      alt=""
      width={compact ? 28 : 48}
      height={compact ? 48 : 96}
      sizes={compact ? "28px" : "48px"}
      className={`shrink-0 object-contain ${compact ? "h-12 w-7" : "h-24 w-12"}`}
    />
  );
}

function SearchInput({
  query,
  onChange,
}: {
  query: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">기기 검색</span>
      <div className="flex items-center gap-2 rounded-control border border-zinc-200 bg-white px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 dark:border-zinc-700 dark:bg-zinc-900">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-4 shrink-0 text-zinc-400"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 4.5 4.5" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(event) => onChange(event.target.value)}
          placeholder="기기명 또는 모델 번호 검색"
          className="w-full bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
        />
      </div>
    </label>
  );
}

function ResultRow({
  device,
  selected,
  full,
  onAdd,
}: {
  device: ConceptDevice;
  selected: boolean;
  full: boolean;
  onAdd: () => void;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-zinc-100 py-3 last:border-b-0 dark:border-zinc-800">
      <DeviceArtwork device={device} compact />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {device.name}
        </p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {device.brand} · {device.processor}
        </p>
      </div>
      <button
        type="button"
        disabled={selected}
        onClick={onAdd}
        aria-label={`${device.name} ${selected ? "선택됨" : full ? "마지막 기기와 교체" : "비교에 추가"}`}
        className="shrink-0 rounded-full border border-brand/25 bg-brand/5 px-2.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/10 disabled:cursor-default disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:border-zinc-800 dark:disabled:bg-zinc-800"
      >
        {selected ? "선택됨" : full ? "교체" : "추가"}
      </button>
    </li>
  );
}

function CompareLink({ devices }: { devices: ConceptDevice[] }) {
  return devices.length > 0 ? (
    <Link
      href={`/${devices.map((device) => device.slug).join("-vs-")}`}
      className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {devices.length === 1 ? "기기 사양 보기" : `${devices.length}대 비교하기`}
      <span aria-hidden="true" className="ml-2">
        →
      </span>
    </Link>
  ) : (
    <span className="inline-flex min-h-10 items-center rounded-full bg-zinc-200 px-4 text-sm font-semibold text-zinc-500 dark:bg-zinc-800">
      기기를 선택하세요
    </span>
  );
}

function OrderActions({
  device,
  index,
  count,
  onMove,
  onRemove,
}: {
  device: ConceptDevice;
  index: number;
  count: number;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (slug: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, -1)}
        aria-label={`${device.name}을(를) 왼쪽으로 이동`}
        className="grid size-7 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
      >
        ←
      </button>
      <button
        type="button"
        disabled={index === count - 1}
        onClick={() => onMove(index, 1)}
        aria-label={`${device.name}을(를) 오른쪽으로 이동`}
        className="grid size-7 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
      >
        →
      </button>
      <button
        type="button"
        onClick={() => onRemove(device.slug)}
        aria-label={`${device.name} 비교 목록에서 제거`}
        className="grid size-7 place-items-center rounded-full text-zinc-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
      >
        ×
      </button>
    </div>
  );
}

export function ComparisonConcepts({
  variant,
  catalog,
  initialSlugs,
}: {
  variant: ConceptVariant;
  catalog: ConceptDevice[];
  initialSlugs: string[];
}) {
  const [selectedSlugs, setSelectedSlugs] = useState(initialSlugs);
  const [query, setQuery] = useState("");
  const selectedDevices = selectedSlugs
    .map((slug) => catalog.find((device) => device.slug === slug))
    .filter((device): device is ConceptDevice => device !== undefined);
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return [...catalog]
      .filter((device) =>
        [device.name, device.slug, ...device.aliases].some((value) =>
          value.toLocaleLowerCase().includes(normalizedQuery),
        ),
      )
      .sort(
        (first, second) =>
          second.releaseDate.localeCompare(first.releaseDate) ||
          first.name.localeCompare(second.name),
      )
      .slice(0, 8);
  }, [catalog, query]);

  function addDevice(slug: string) {
    setSelectedSlugs((current) => {
      if (current.includes(slug)) return current;
      return current.length >= 3
        ? [...current.slice(0, 2), slug]
        : [...current, slug];
    });
  }

  function removeDevice(slug: string) {
    setSelectedSlugs((current) => current.filter((item) => item !== slug));
  }

  function moveDevice(index: number, direction: -1 | 1) {
    setSelectedSlugs((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function renderResults(twoColumns = false) {
    return (
      <ul className={twoColumns ? "grid gap-x-6 md:grid-cols-2" : undefined}>
        {results.map((device) => (
          <ResultRow
            key={device.slug}
            device={device}
            selected={selectedSlugs.includes(device.slug)}
            full={selectedSlugs.length >= 3}
            onAdd={() => addDevice(device.slug)}
          />
        ))}
        {results.length === 0 ? (
          <li className="py-8 text-center text-sm text-zinc-500">
            검색 결과가 없습니다.
          </li>
        ) : null}
      </ul>
    );
  }

  return (
    <main className="flex-1 bg-zinc-50 px-4 py-8 sm:px-6 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-brand dark:text-blue-400">
              DEVICE LOVER / UI CONCEPTS
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              기기 비교 목록 시안
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              기기 3대까지 추가하고 순서를 바꿔보세요. 시안의 선택 상태는 이 페이지에서만 유지됩니다.
            </p>
          </div>
          <nav aria-label="비교 목록 시안 선택" className="flex gap-2">
            {(["1", "2", "3"] as const).map((number) => (
              <Link
                key={number}
                href={`/test/comp/${number}`}
                aria-current={variant === number ? "page" : undefined}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                  variant === number
                    ? "border-brand bg-brand text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-brand hover:text-brand dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                }`}
              >
                {number}안
              </Link>
            ))}
          </nav>
        </div>

        <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
            {concepts[variant].name}
          </h2>
          <p className="text-sm font-medium text-brand dark:text-blue-400">
            {concepts[variant].tagline}
          </p>
          <p className="w-full text-sm text-zinc-500 dark:text-zinc-400">
            {concepts[variant].description}
          </p>
        </div>

        {variant === "1" ? (
          <div className="space-y-5">
            <section className="rounded-sheet border border-zinc-200 bg-white p-5 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.12em] text-brand">YOUR LINEUP</p>
                  <h3 className="mt-1 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    비교할 기기 <span className="text-brand">{selectedDevices.length}/3</span>
                  </h3>
                </div>
                <CompareLink devices={selectedDevices} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[0, 1, 2].map((index) => {
                  const device = selectedDevices[index];
                  return device ? (
                    <article
                      key={device.slug}
                      className="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-surface border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand dark:bg-brand/20 dark:text-blue-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <OrderActions
                          device={device}
                          index={index}
                          count={selectedDevices.length}
                          onMove={moveDevice}
                          onRemove={removeDevice}
                        />
                      </div>
                      <div className="flex items-end gap-4">
                        <DeviceArtwork device={device} />
                        <div className="min-w-0 pb-1">
                          <p className="text-[11px] font-semibold tracking-widest text-zinc-500">
                            {device.brand}
                          </p>
                          <h4 className="mt-1 text-lg font-bold leading-tight text-zinc-950 dark:text-zinc-50">
                            {device.name}
                          </h4>
                          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            {device.display} · {device.variant}
                          </p>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <div
                      key={index}
                      className="flex min-h-48 flex-col items-center justify-center rounded-surface border border-dashed border-zinc-300 bg-zinc-50/70 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/40"
                    >
                      <span aria-hidden="true" className="text-3xl font-light">+</span>
                      <span className="mt-2 text-sm font-medium">기기 {index + 1} 추가</span>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="rounded-sheet border border-zinc-200 bg-white p-5 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">기기 찾아보기</h3>
                <p className="text-xs text-zinc-500">3대일 때 새 기기를 추가하면 마지막 기기가 교체됩니다.</p>
              </div>
              <SearchInput query={query} onChange={setQuery} />
              <div className="mt-2">{renderResults(true)}</div>
            </section>
          </div>
        ) : null}

        {variant === "2" ? (
          <div className="space-y-4">
            <section className="rounded-sheet border border-zinc-200 bg-white p-3 shadow-sm sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-bold text-zinc-500">비교 목록</span>
                {selectedDevices.map((device, index) => (
                  <div
                    key={device.slug}
                    className="flex max-w-full items-center gap-2 rounded-control border border-brand/20 bg-brand/5 py-1.5 pl-2 pr-1 dark:border-brand/30 dark:bg-brand/10"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {device.name}
                    </span>
                    <OrderActions
                      device={device}
                      index={index}
                      count={selectedDevices.length}
                      onMove={moveDevice}
                      onRemove={removeDevice}
                    />
                  </div>
                ))}
                {selectedDevices.length < 3 ? (
                  <span className="rounded-control border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-400 dark:border-zinc-700">
                    + 기기 추가
                  </span>
                ) : null}
                <div className="ml-auto"><CompareLink devices={selectedDevices} /></div>
              </div>
            </section>
            <section className="overflow-hidden rounded-surface border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">사양 미리보기</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] table-fixed text-left text-sm">
                  <caption className="sr-only">선택한 기기 사양 미리보기</caption>
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                    <tr>
                      <th scope="col" className="w-28 px-5 py-4 text-xs text-zinc-500">사양</th>
                      {selectedDevices.map((device) => (
                        <th key={device.slug} scope="col" className="px-5 py-4 font-bold text-zinc-950 dark:text-zinc-50">
                          {device.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      ["화면", "display"],
                      ["프로세서", "processor"],
                      ["후면 카메라", "camera"],
                    ] as const).map(([label, key]) => (
                      <tr key={key} className="border-t border-zinc-100 dark:border-zinc-800">
                        <th scope="row" className="px-5 py-4 text-xs font-medium text-zinc-500">{label}</th>
                        {selectedDevices.map((device) => (
                          <td key={device.slug} className="px-5 py-4 text-zinc-700 dark:text-zinc-300">
                            {device[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="rounded-surface border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">기기 추가 또는 교체</h3>
                <span className="text-xs text-zinc-500">선택 {selectedDevices.length}/3</span>
              </div>
              <SearchInput query={query} onChange={setQuery} />
              <div className="mt-2">{renderResults(true)}</div>
            </section>
          </div>
        ) : null}

        {variant === "3" ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
            <section className="min-w-0 rounded-sheet border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4">
                <p className="text-xs font-bold tracking-[0.12em] text-brand">01 / EXPLORE</p>
                <h3 className="mt-1 text-lg font-bold text-zinc-950 dark:text-zinc-50">기기 탐색</h3>
              </div>
              <SearchInput query={query} onChange={setQuery} />
              <p className="mt-3 text-xs text-zinc-500">검색 결과 {results.length}개 표시</p>
              <div className="mt-1 max-h-[540px] overflow-y-auto pr-1">{renderResults()}</div>
            </section>
            <section className="min-w-0 rounded-sheet border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.12em] text-brand">02 / COMPARE</p>
                  <h3 className="mt-1 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    선택한 기기 <span className="text-brand">{selectedDevices.length}/3</span>
                  </h3>
                </div>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-500 dark:bg-zinc-800">
                  순서 변경 가능
                </span>
              </div>
              <div className="space-y-2">
                {selectedDevices.map((device, index) => (
                  <article
                    key={device.slug}
                    className="flex items-center gap-3 rounded-surface border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <DeviceArtwork device={device} compact />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-zinc-950 dark:text-zinc-50">{device.name}</h4>
                      <p className="truncate text-xs text-zinc-500">{device.display} · {device.processor}</p>
                    </div>
                    <OrderActions
                      device={device}
                      index={index}
                      count={selectedDevices.length}
                      onMove={moveDevice}
                      onRemove={removeDevice}
                    />
                  </article>
                ))}
                {selectedDevices.length < 3 ? (
                  <div className="flex min-h-16 items-center justify-center rounded-surface border border-dashed border-zinc-300 text-xs text-zinc-400 dark:border-zinc-700">
                    왼쪽에서 기기를 추가하세요
                  </div>
                ) : null}
              </div>
              <div className="mt-5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <p className="mb-3 text-xs leading-5 text-zinc-500">
                  최대 3대까지 비교합니다. 목록이 가득 찬 상태에서 새 기기를 고르면 세 번째 기기가 교체됩니다.
                </p>
                <div className="flex justify-end"><CompareLink devices={selectedDevices} /></div>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

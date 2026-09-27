"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { recordDeviceSelection } from "../api/client";
import { buildComparisonPath } from "../model/comparison-path";
import type { DeviceSearchItem } from "../model/device";
import { useDeviceSearch } from "../model/use-device-search";

export function DeviceSearch({
  selectedDevices,
}: {
  selectedDevices: DeviceSearchItem[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { searchState, isLoading } = useDeviceSearch(query, isOpen);
  const selectedDeviceSlugs = selectedDevices.map((device) => device.slug);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function navigateTo(path: string) {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  }

  function viewDevice(device: DeviceSearchItem) {
    recordDeviceSelection({
      category: device.category,
      slug: device.slug,
      action: "view",
    });
    navigateTo(`/${device.slug}`);
  }

  function addToComparison(device: DeviceSearchItem) {
    const comparisonPath = buildComparisonPath(selectedDevices, device);

    if (comparisonPath) {
      recordDeviceSelection({
        category: device.category,
        slug: device.slug,
        action: "compare",
      });
      navigateTo(comparisonPath);
    }
  }

  const searchResults =
    searchState.result.status === "ready" ? searchState.result.results : [];
  const resultsHeading = isLoading
    ? "검색 중…"
    : searchState.result.status === "error"
      ? "검색 오류"
      : query
        ? `검색 결과 ${searchResults.length}개`
        : "인기 기기";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-blue-300"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-[18px]"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">검색</span>
      </button>

      {isOpen ? createPortal(
        <div
          role="presentation"
          onMouseDown={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/45 px-4 py-[8vh] backdrop-blur-sm"
        >
          <section
            data-search-panel
            role="dialog"
            aria-modal="true"
            aria-labelledby="device-search-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="flex max-h-[84vh] w-full max-w-2xl flex-col overflow-hidden rounded-sheet border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-950"
          >
            <div className="flex items-center gap-3 border-b border-zinc-200 p-3 dark:border-zinc-800">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-5 shrink-0 text-zinc-400"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" strokeLinecap="round" />
              </svg>
              <label htmlFor="device-search-input" className="sr-only">
                기기 검색
              </label>
              <input
                id="device-search-input"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="기기명 또는 모델 번호 검색"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="검색 닫기"
                className="grid size-8 shrink-0 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="size-5"
                >
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div
              aria-live="polite"
              className="flex items-center justify-between border-b border-zinc-100 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
            >
              <h2 id="device-search-title" className="font-semibold">
                {resultsHeading}
              </h2>
              <span>{selectedDeviceSlugs.length}/3개 선택</span>
            </div>

            <ul className="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
              {searchResults.map((device) => {
                const isSelected = selectedDeviceSlugs.includes(device.slug);
                const reachedLimit = selectedDeviceSlugs.length >= 3;
                const changesCategory =
                  selectedDevices.length > 0 &&
                  selectedDevices[0].category !== device.category;

                return (
                  <li
                    key={device.slug}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                        {device.brand} · {device.category === "camera" ? "카메라" : "스마트폰"}
                      </p>
                      <p className="truncate font-semibold text-zinc-950 dark:text-zinc-50">
                        {device.name}
                      </p>
                      {device.aliases.length > 0 ? (
                        <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {device.aliases.join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => viewDevice(device)}
                        className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
                      >
                        기기 보기
                      </button>
                      <button
                        type="button"
                        disabled={isSelected}
                        onClick={() => addToComparison(device)}
                        className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
                      >
                        {isSelected
                          ? "추가됨"
                          : changesCategory
                            ? `${device.category === "camera" ? "카메라" : "스마트폰"} 비교로 전환`
                          : reachedLimit
                            ? "마지막 기기 변경"
                            : "비교에 추가"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {!isLoading && searchState.result.status === "error" ? (
              <p className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
              </p>
            ) : !isLoading && searchResults.length === 0 ? (
              <p className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                일치하는 기기가 없습니다.
              </p>
            ) : null}
          </section>
        </div>,
        document.body,
      ) : null}
    </>
  );
}

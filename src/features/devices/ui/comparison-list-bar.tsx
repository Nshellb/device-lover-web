"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { DeviceSearchItem } from "../model/device";

type ComparisonListBarProps = {
  selectedDevices: DeviceSearchItem[];
};

function getTableForSelection(deviceSlugs: string): HTMLElement | undefined {
  const tables = document.querySelectorAll<HTMLElement>("#comparison-table");
  return [...tables].find((table) => table.dataset.deviceSlugs === deviceSlugs);
}

function waitForTableSelection(deviceSlugs: string): Promise<void> {
  return new Promise((resolve) => {
    let timeout = 0;
    const observer = new MutationObserver(checkSelection);

    function finish() {
      observer.disconnect();
      window.clearTimeout(timeout);
      resolve();
    }

    function checkSelection() {
      if (getTableForSelection(deviceSlugs)) {
        finish();
      }
    }

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-device-slugs"],
    });
    timeout = window.setTimeout(finish, 3000);
    checkSelection();
  });
}

export function ComparisonListBar({
  selectedDevices,
}: ComparisonListBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const chipRefs = useRef(new Map<string, HTMLDivElement>());
  const previousPositions = useRef(new Map<string, DOMRect>());

  const selectedSlugs = selectedDevices.map((device) => device.slug);
  const selectionKey = selectedSlugs.join("|");

  useEffect(() => {
    if (!isOpen || pathname.startsWith("/test/comp/")) return;

    let previousY = Math.max(0, window.scrollY);
    let downwardDistance = 0;

    function onScroll() {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousY;
      previousY = currentY;

      if (delta < 0) downwardDistance = 0;
      if (delta <= 0) return;

      downwardDistance += delta;
      if (downwardDistance < 12) return;

      if (panelRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus({ preventScroll: true });
      }
      setIsOpen(false);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen, pathname]);

  useLayoutEffect(() => {
    const positions = previousPositions.current;
    previousPositions.current = new Map();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    for (const [slug, chip] of chipRefs.current) {
      const previous = positions.get(slug);
      if (!previous) continue;

      const current = chip.getBoundingClientRect();
      const x = previous.left - current.left;
      const y = previous.top - current.top;
      if (Math.abs(x) + Math.abs(y) < 1) continue;

      chip.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0)` },
          { transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: 460,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
    }
  }, [selectionKey]);

  function rememberPositions() {
    previousPositions.current = new Map(
      [...chipRefs.current].map(([slug, chip]) => [
        slug,
        chip.getBoundingClientRect(),
      ]),
    );
  }

  function navigateToSelection(slugs: string[]) {
    if (slugs.length > 0) {
      rememberPositions();
      const path = `/${slugs.join("-vs-")}`;
      const nextSelection = slugs.join("|");
      const navigate = () => router.push(path, { scroll: false });

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.getElementById("comparison-table")?.dataset.deviceSlugs ===
          nextSelection
      ) {
        navigate();
        return;
      }

      if (!document.startViewTransition) {
        const tableUpdated = waitForTableSelection(nextSelection);
        navigate();
        void tableUpdated.then(() => {
          getTableForSelection(nextSelection)?.animate(
            [
              { opacity: 0, transform: "translateY(10px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 460, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
          );
        });
        return;
      }

      void document
        .startViewTransition(async () => {
          // Keep the old table visible until the new route has rendered.
          const tableUpdated = waitForTableSelection(nextSelection);
          navigate();
          await tableUpdated;
        })
        .finished.catch(() => {});
    }
  }

  function moveDevice(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= selectedSlugs.length) return;

    const next = [...selectedSlugs];
    [next[index], next[target]] = [next[target], next[index]];
    navigateToSelection(next);
  }

  function removeDevice(slug: string) {
    if (selectedSlugs.length <= 1) return;
    navigateToSelection(selectedSlugs.filter((selected) => selected !== slug));
  }

  if (pathname.startsWith("/test/comp/")) {
    return null;
  }

  return (
    <div data-comparison-bar className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-11 w-full max-w-6xl items-center px-4 sm:px-6">
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="comparison-list-panel"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-zinc-700 transition-[color,background-color,transform] duration-300 ease-out hover:bg-zinc-100 hover:text-brand active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-blue-300"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-[18px]"
          >
            <rect x="3" y="5" width="7" height="14" rx="1.5" />
            <rect x="14" y="5" width="7" height="14" rx="1.5" />
          </svg>
          비교 목록
          <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[11px] font-bold leading-none text-brand dark:bg-brand/20 dark:text-blue-300">
            {selectedDevices.length}/3
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={`size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="ml-auto hidden truncate text-xs text-zinc-500 sm:block dark:text-zinc-400">
          {selectedDevices.length > 0
            ? selectedDevices.map((device) => device.name).join(" · ")
            : "기기를 선택해 비교해보세요"}
        </span>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <section
          ref={panelRef}
          id="comparison-list-panel"
          aria-label="선택한 기기 비교 목록"
          aria-hidden={!isOpen}
          inert={!isOpen}
          className="min-h-0 overflow-hidden"
        >
          <div
            className={`mx-auto w-full max-w-6xl px-4 pb-3 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none sm:px-6 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
          >
            <div data-comparison-panel className="rounded-sheet border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="flex flex-wrap items-center gap-2">
                <p className="mr-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  선택한 기기
                </p>
                {selectedDevices.map((device, index) => (
                  <div
                    key={device.slug}
                    style={{
                      viewTransitionName: isOpen
                        ? `selected-device-${device.slug}`
                        : "none",
                    }}
                    ref={(node) => {
                      if (node) chipRefs.current.set(device.slug, node);
                      else chipRefs.current.delete(device.slug);
                    }}
                    className="flex min-w-0 max-w-full items-center gap-1.5 rounded-control border border-brand/20 bg-white py-1.5 pl-2 pr-1 animate-[comparison-chip-enter_380ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none dark:border-brand/30 dark:bg-zinc-900"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="min-w-0 truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {device.name}
                    </span>
                    <div className="flex shrink-0 items-center">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveDevice(index, -1)}
                        aria-label={`${device.name} 왼쪽으로 이동`}
                        className="grid size-7 place-items-center rounded-full text-zinc-500 enabled:hover:bg-zinc-100 disabled:opacity-30 dark:enabled:hover:bg-zinc-800"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-3.5"
                        >
                          <path d="M11.5 3.25 5 8l6.5 4.75V3.25Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        disabled={index === selectedDevices.length - 1}
                        onClick={() => moveDevice(index, 1)}
                        aria-label={`${device.name} 오른쪽으로 이동`}
                        className="grid size-7 place-items-center rounded-full text-zinc-500 enabled:hover:bg-zinc-100 disabled:opacity-30 dark:enabled:hover:bg-zinc-800"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-3.5"
                        >
                          <path d="M4.5 3.25 11 8l-6.5 4.75V3.25Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        disabled={selectedDevices.length <= 1}
                        onClick={() => removeDevice(device.slug)}
                        aria-label={`${device.name} 비교 목록에서 제거`}
                        className="grid size-7 place-items-center rounded-full text-zinc-500 enabled:hover:bg-rose-50 enabled:hover:text-rose-600 disabled:opacity-30 dark:enabled:hover:bg-rose-950/30"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {selectedDevices.length === 0 ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    선택한 기기가 없습니다.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

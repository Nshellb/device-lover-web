import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import {
  LOGO_COLORS,
  LOGO_PATHS,
  LOGO_STATS,
  LOGO_SVG_SOURCE,
  LogoMark,
  LogoPaths,
} from "./_components/logo-mark";

export const metadata: Metadata = {
  title: "로고 시안",
  description: "Device Lover 로고를 곡선이 적은 경로로 다듬은 시안입니다.",
  robots: { index: false, follow: false },
};

// 이전 로고(public/device-lover-logo-legacy.svg)는 1254px 캔버스 안에서 마크가
// (333, 277)부터 시작한다. 같은 좌표계로 그려야 나란히, 또는 겹쳐 볼 수 있다.
const LEGACY_FRAME = { size: 1254, x: 333, y: 277 } as const;
const LEGACY_FRAME_VIEW_BOX = `0 0 ${LEGACY_FRAME.size} ${LEGACY_FRAME.size}`;
const LEGACY_FRAME_OFFSET = `translate(${LEGACY_FRAME.x} ${LEGACY_FRAME.y})`;

const BACKGROUNDS = [
  { label: "흰 배경", className: "bg-white text-zinc-500" },
  { label: "회색 배경", className: "bg-zinc-100 text-zinc-500" },
  { label: "어두운 배경", className: "bg-zinc-900 text-zinc-400" },
] as const;

const SIZES = [16, 24, 32, 40, 64] as const;

const SVG_DOWNLOAD_HREF = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_SVG_SOURCE)}`;

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 rounded-sheet border border-zinc-200 bg-white p-5 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-surface border border-zinc-200 bg-white dark:border-zinc-700">
      <div className="aspect-square">{children}</div>
      <figcaption className="border-t border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        {label}
      </figcaption>
    </figure>
  );
}

export default function LogoTestPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <p className="inline-flex rounded-full border border-brand/20 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand dark:text-blue-300">
        로고 시안 · 곡선 {LOGO_STATS.curves}개
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
        다듬은 Device Lover 로고
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        꼭짓점 946개로 이어 붙인 계단형 경로를 직선과 곡선 {LOGO_STATS.curves}개(베지어
        2 · 호 7)로 다시 그렸습니다. L과 D 사이 틈, 모서리 반지름은 같은 값으로
        맞췄고, 어두운 배경에서도 보이도록 D는 #012B7B에서 {LOGO_COLORS.d}로, L은
        #007DFD에서 {LOGO_COLORS.l}로 밝혔습니다. 사이트 헤더와 파비콘에도 이
        로고를 씁니다.
      </p>

      <Section
        title="이전 로고와 비교"
        description="같은 크기·같은 위치로 맞췄습니다. 오른쪽은 다듬은 윤곽선을 이전 로고 위에 겹친 모습입니다."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Tile label="이전 (device-lover-logo-legacy.svg)">
            <Image
              src="/device-lover-logo-legacy.svg"
              alt="이전 Device Lover 로고"
              width={360}
              height={360}
              className="size-full"
            />
          </Tile>
          <Tile label="다듬은 로고">
            <svg
              viewBox={LEGACY_FRAME_VIEW_BOX}
              role="img"
              aria-label="다듬은 Device Lover 로고"
              className="size-full"
            >
              <g transform={LEGACY_FRAME_OFFSET}>
                <LogoPaths />
              </g>
            </svg>
          </Tile>
          <Tile label="겹쳐 보기">
            <div className="relative size-full">
              <Image
                src="/device-lover-logo-legacy.svg"
                alt=""
                aria-hidden="true"
                width={360}
                height={360}
                className="size-full"
              />
              <svg
                viewBox={LEGACY_FRAME_VIEW_BOX}
                aria-hidden="true"
                className="absolute inset-0 size-full"
                fill="none"
                stroke="#ec0a8c"
                strokeWidth={1.5}
              >
                <g transform={LEGACY_FRAME_OFFSET}>
                  <path d={LOGO_PATHS.d} vectorEffect="non-scaling-stroke" />
                  <path d={LOGO_PATHS.l} vectorEffect="non-scaling-stroke" />
                </g>
              </svg>
            </div>
          </Tile>
        </div>
      </Section>

      <Section title="배경과 크기">
        <div className="grid gap-4 sm:grid-cols-3">
          {BACKGROUNDS.map(({ label, className }) => (
            <div
              key={label}
              className={`flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-surface border border-zinc-200 text-xs font-medium dark:border-zinc-700 ${className}`}
            >
              <LogoMark size={112} />
              {label}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-5 rounded-surface border border-zinc-200 bg-white p-5 dark:border-zinc-700">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <LogoMark size={size} aria-hidden="true" />
              <span className="text-xs tabular-nums text-zinc-500">{size}px</span>
            </div>
          ))}
          <div className="flex items-center gap-3 sm:ml-auto">
            <LogoMark size={40} aria-hidden="true" />
            <span className="text-lg font-semibold tracking-tight text-zinc-950">
              Device Lover
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="SVG 소스"
        description={`명령 ${LOGO_STATS.commands}개, 그중 곡선 ${LOGO_STATS.curves}개입니다.`}
        action={
          <a
            href={SVG_DOWNLOAD_HREF}
            download="device-lover-logo-refined.svg"
            className="rounded-control border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            SVG 내려받기
          </a>
        }
      >
        <pre className="overflow-x-auto rounded-surface bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
          <code>{LOGO_SVG_SOURCE}</code>
        </pre>
      </Section>
    </main>
  );
}

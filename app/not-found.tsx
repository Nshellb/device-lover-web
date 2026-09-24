"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function sanitizedReferrer(): string | null {
  if (!document.referrer) return null;

  try {
    const referrer = new URL(document.referrer);
    return `${referrer.origin}${referrer.pathname}`.slice(0, 1024);
  } catch {
    return null;
  }
}

function viewportClass(): "mobile" | "tablet" | "desktop" {
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    void fetch("/api/route-misses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        requestedPath: pathname,
        referrer: sanitizedReferrer(),
        locale: navigator.language?.slice(0, 35) || null,
        viewportClass: viewportClass(),
      }),
      keepalive: true,
    }).catch(() => {
      // Analytics must never prevent the 404 page from working.
    });
  }, [pathname]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-[0.16em] text-brand">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        기기를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        주소가 잘못 입력되었거나 아직 등록되지 않은 기기입니다. 상단 검색에서 기기명을 다시
        찾아보세요.
      </p>
      <p className="mt-2 max-w-md break-all font-mono text-xs text-zinc-400 dark:text-zinc-500">
        {pathname}
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        홈으로 이동
      </Link>
    </main>
  );
}

"use client";

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

export function NotFoundDetails() {
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
    <p className="mt-2 max-w-md break-all font-mono text-xs text-zinc-400 dark:text-zinc-500">
      {pathname}
    </p>
  );
}

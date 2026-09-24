"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        서비스에 일시적으로 연결할 수 없습니다. 잠시 후 다시 시도해주세요.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        다시 시도
      </button>
    </main>
  );
}

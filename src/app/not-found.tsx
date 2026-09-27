import Link from "next/link";

import { NotFoundDetails } from "./_components/not-found-details";

export default function NotFound() {
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
      <NotFoundDetails />
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        홈으로 이동
      </Link>
    </main>
  );
}

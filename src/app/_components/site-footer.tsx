export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-400">
        <p>
          © {new Date().getFullYear()} {" "}
          <span className="font-semibold text-brand dark:text-blue-400">
            Device Lover
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          좋아하는 기기를 더 쉽게 비교하세요.
        </p>
      </div>
    </footer>
  );
}

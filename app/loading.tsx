export default function Loading() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header skeleton */}
      <div className="h-8 w-48 rounded-lg bg-(--bg-elevated) animate-pulse" />

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-(--border-default) bg-(--bg-surface) p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-(--bg-elevated) animate-pulse" />
              <div className="h-8 w-8 rounded-lg bg-(--bg-elevated) animate-pulse" />
            </div>
            <div className="h-7 w-28 rounded bg-(--bg-elevated) animate-pulse" />
            <div className="h-3 w-16 rounded bg-(--bg-elevated) animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl border border-(--border-default) bg-(--bg-surface) p-5 h-64 animate-pulse" />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-(--border-default) bg-(--bg-surface) p-5 h-48 animate-pulse" />
        <div className="rounded-2xl border border-(--border-default) bg-(--bg-surface) p-5 h-48 animate-pulse" />
      </div>
    </div>
  );
}

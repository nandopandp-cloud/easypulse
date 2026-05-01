export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-3.5 w-28 animate-pulse rounded-full bg-muted" />
          <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-8 w-10 animate-pulse rounded-lg bg-muted" />
              </div>
              <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <div className="h-5 w-40 animate-pulse rounded-full bg-muted" />
          <div className="mt-1.5 h-3.5 w-64 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-9 w-9 animate-pulse rounded-xl bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

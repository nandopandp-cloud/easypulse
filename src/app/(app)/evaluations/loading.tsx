export default function EvaluationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-52 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 px-5 py-3.5">
          <div className="flex gap-6">
            {["w-32", "w-28", "w-20", "w-24", "w-16"].map((w, i) => (
              <div key={i} className={`h-3 ${w} animate-pulse rounded-full bg-muted`} />
            ))}
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 border-b px-5 py-4 last:border-0">
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-44 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

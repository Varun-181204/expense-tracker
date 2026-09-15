export const StatSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
        <div className="h-7 w-36 bg-slate-200 rounded"></div>
      </div>
      <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
    </div>
    <div className="h-3 w-28 bg-slate-100 rounded mt-4"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-5 w-40 bg-slate-200 rounded"></div>
      <div className="h-4 w-20 bg-slate-100 rounded"></div>
    </div>
    <div className="h-64 bg-slate-100 rounded-xl"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs animate-pulse">
    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
      <div className="h-5 w-32 bg-slate-200 rounded"></div>
      <div className="h-8 w-24 bg-slate-100 rounded"></div>
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-200 rounded-lg"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-3 w-20 bg-slate-100 rounded"></div>
            </div>
          </div>
          <div className="h-4 w-16 bg-slate-200 rounded"></div>
          <div className="h-5 w-20 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

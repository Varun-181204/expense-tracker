const StatCard = ({
  title,
  amount,
  subtitle,
  icon: Icon,
  color = "indigo", // "indigo", "emerald", "rose", "purple", "amber"
  badge,
}) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {amount}
          </h3>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${scheme.bg} ${scheme.text} shadow-xs`}
          >
            <Icon />
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-md font-semibold ${scheme.bg} ${scheme.text}`}
            >
              {badge}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;

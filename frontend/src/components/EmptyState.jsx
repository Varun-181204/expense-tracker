import { FaInbox } from "react-icons/fa";

const EmptyState = ({
  icon: Icon = FaInbox,
  title = "No data found",
  description = "Get started by adding your first record.",
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-4">
        <Icon />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

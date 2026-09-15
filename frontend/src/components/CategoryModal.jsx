import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaSave } from "react-icons/fa";

const PRESET_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#64748B", // Slate
];

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#6366F1",
    icon: "Tag",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "expense",
        color: initialData.color || "#6366F1",
        icon: initialData.icon || "Tag",
      });
    } else {
      setFormData({
        name: "",
        type: "expense",
        color: "#6366F1",
        icon: "Tag",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }
    setError("");
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">
            {initialData ? "Edit Category" : "New Custom Category"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Selection (only allowed on creation) */}
          {!initialData && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Category Type
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense" })}
                  className={`py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    formData.type === "expense"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income" })}
                  className={`py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    formData.type === "income"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Subscriptions, Consulting, Gym..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Color Tag
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    formData.color === c ? "scale-125 ring-2 ring-offset-2 ring-slate-900" : "hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {initialData ? <FaSave /> : <FaPlus />}
              <span>{loading ? "Saving..." : initialData ? "Save Changes" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

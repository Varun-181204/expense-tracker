import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaSave, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatDateInput } from "../utils/formatters";

const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: formatDateInput(new Date()),
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        amount: initialData.amount || "",
        type: initialData.type || "expense",
        category: initialData.category || "",
        date: initialData.date ? formatDateInput(new Date(initialData.date)) : formatDateInput(new Date()),
        description: initialData.description || "",
      });
    } else {
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: formatDateInput(new Date()),
        description: "",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Filter categories by the currently selected type
  const availableCategories = categories.filter((c) => c.type === formData.type);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid amount greater than zero");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    setError("");
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">
            {initialData ? "Edit Transaction" : "Add New Transaction"}
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
          {/* Type Toggle: Expense vs Income */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  formData.type === "expense"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaArrowDown className="text-xs" />
                <span>Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  formData.type === "income"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaArrowUp className="text-xs" />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Title / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery shopping, Client invoice..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Amount and Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                required
              >
                <option value="">Select Category</option>
                {availableCategories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              required
            />
          </div>

          {/* Notes / Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add payment method, notes, or tags..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
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
              <span>{loading ? "Saving..." : initialData ? "Save Changes" : "Add Transaction"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

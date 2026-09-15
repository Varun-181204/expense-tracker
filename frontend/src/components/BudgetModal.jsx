import { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialMonth = new Date().getMonth() + 1,
  initialYear = new Date().getFullYear(),
  initialCategory = "Overall",
  initialAmount = "",
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    month: initialMonth,
    year: initialYear,
    targetType: initialCategory === "Overall" ? "overall" : "category",
    category: initialCategory === "Overall" ? "" : initialCategory,
    amount: initialAmount || "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      month: initialMonth,
      year: initialYear,
      targetType: initialCategory === "Overall" ? "overall" : "category",
      category: initialCategory === "Overall" ? "" : initialCategory,
      amount: initialAmount || "",
    });
    setError("");
  }, [initialMonth, initialYear, initialCategory, initialAmount, isOpen]);

  if (!isOpen) return null;

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid budget amount greater than zero");
      return;
    }

    if (formData.targetType === "category" && !formData.category) {
      setError("Please select an expense category");
      return;
    }

    setError("");
    onSubmit({
      month: Number(formData.month),
      year: Number(formData.year),
      category: formData.targetType === "category" ? formData.category : "Overall",
      amount: Number(formData.amount),
      isCategory: formData.targetType === "category",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">
            Set Monthly Budget
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
          {/* Target: Overall vs Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Budget Target
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, targetType: "overall" })}
                className={`py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  formData.targetType === "overall"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Overall Total
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, targetType: "category" })}
                className={`py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  formData.targetType === "category"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Category Specific
              </button>
            </div>
          </div>

          {/* Category Dropdown if Category specific */}
          {formData.targetType === "category" && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Expense Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                required
              >
                <option value="">Select Category</option>
                {expenseCategories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Month & Year Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Month
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {MONTHS.map((name, index) => (
                  <option key={index + 1} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Budget Amount (₹)
            </label>
            <input
              type="number"
              step="1"
              min="1"
              placeholder="e.g. 50000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
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
              <FaSave />
              <span>{loading ? "Saving..." : "Set Budget"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;

import { useState, useEffect } from "react";
import {
  FaBullseye,
  FaPlus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaTrash,
} from "react-icons/fa";
import Layout from "../components/Layout";
import BudgetModal from "../components/BudgetModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { TableSkeleton } from "../components/LoadingSkeleton";
import {
  getBudgetSummary,
  setOverallBudget,
  setCategoryBudget,
  deleteBudget,
} from "../services/budgetService";
import { getCategories } from "../services/categoryService";
import { formatCurrency, formatMonthYear } from "../utils/formatters";
import { toast } from "react-toastify";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Budgets = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [budgetData, setBudgetData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Categories error:", err.message);
    }
  };

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const data = await getBudgetSummary(selectedMonth, selectedYear);
      setBudgetData(data);
    } catch (err) {
      toast.error(err.message || "Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth, selectedYear]);

  const handleSaveBudget = async (formData) => {
    try {
      setSavingBudget(true);
      if (formData.isCategory) {
        await setCategoryBudget({
          month: formData.month,
          year: formData.year,
          category: formData.category,
          amount: formData.amount,
        });
        toast.success(`Budget for "${formData.category}" saved!`);
      } else {
        await setOverallBudget({
          month: formData.month,
          year: formData.year,
          amount: formData.amount,
        });
        toast.success("Overall monthly budget updated!");
      }
      setModalOpen(false);
      fetchBudget();
    } catch (err) {
      toast.error(err.message || "Failed to save budget");
    } finally {
      setSavingBudget(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;
    try {
      setDeleting(true);
      await deleteBudget(budgetToDelete._id);
      toast.success("Budget entry removed");
      setDeleteModalOpen(false);
      setBudgetToDelete(null);
      fetchBudget();
    } catch (err) {
      toast.error(err.message || "Failed to delete budget");
    } finally {
      setDeleting(false);
    }
  };

  const overall = budgetData?.overall || {
    budget: 0,
    spent: 0,
    remaining: 0,
    percentage: 0,
    status: "no_budget",
  };

  const categoryBudgets = budgetData?.categories || [];

  return (
    <Layout
      title="Budget Management"
      subtitle="Track your spending limits and prevent overspending"
      onQuickAdd={() => setModalOpen(true)}
    >
      {/* Month / Year Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
            <FaCalendarAlt />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {formatMonthYear(selectedMonth, selectedYear)}
            </h3>
            <p className="text-xs text-slate-500">Budget target period</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm bg-white font-medium focus:ring-2 focus:ring-indigo-500"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm bg-white font-medium focus:ring-2 focus:ring-indigo-500"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <FaPlus />
            <span className="hidden sm:inline">Set Budget</span>
          </button>
        </div>
      </div>

      {/* Main Overall Monthly Budget Card */}
      {loading ? (
        <div className="mb-8">
          <TableSkeleton rows={3} />
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Overall Monthly Budget
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {overall.budget > 0 ? formatCurrency(overall.budget) : "No Budget Set"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                For {formatMonthYear(selectedMonth, selectedYear)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {overall.budget > 0 && (
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                    overall.status === "exceeded"
                      ? "bg-rose-100 text-rose-700"
                      : overall.status === "warning"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {overall.status === "exceeded" ? (
                    <>
                      <FaExclamationTriangle />
                      <span>Budget Exceeded</span>
                    </>
                  ) : overall.status === "warning" ? (
                    <>
                      <FaExclamationTriangle />
                      <span>Near Budget limit</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>On Track</span>
                    </>
                  )}
                </span>
              )}

              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
              >
                {overall.budget > 0 ? "Change Budget" : "Set Monthly Budget"}
              </button>
            </div>
          </div>

          {/* Progress Bar & Key Metrics */}
          {overall.budget > 0 ? (
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-600">
                    Total Spent: {formatCurrency(overall.spent)} ({overall.percentage}%)
                  </span>
                  <span
                    className={
                      overall.remaining >= 0 ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    {overall.remaining >= 0
                      ? `${formatCurrency(overall.remaining)} remaining`
                      : `${formatCurrency(Math.abs(overall.remaining))} over budget`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      overall.status === "exceeded"
                        ? "bg-rose-500"
                        : overall.status === "warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(overall.percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-medium text-slate-500">Allocated Budget</p>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    {formatCurrency(overall.budget)}
                  </h4>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-medium text-slate-500">Total Spent</p>
                  <h4 className="text-xl font-bold text-rose-600 mt-1">
                    {formatCurrency(overall.spent)}
                  </h4>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-medium text-slate-500">Remaining Balance</p>
                  <h4
                    className={`text-xl font-bold mt-1 ${
                      overall.remaining >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {formatCurrency(overall.remaining)}
                  </h4>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center py-6">
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                You haven't configured an overall budget for {formatMonthYear(selectedMonth, selectedYear)}. Setting a budget helps you maintain spending limits and receive alerts.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition cursor-pointer"
              >
                <FaBullseye />
                <span>Set Overall Budget Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category-Specific Budgets Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900">Category Budgets</h3>
          <p className="text-xs text-slate-500">
            Monitor limits and spending per individual category
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
        >
          <FaPlus className="text-[10px]" />
          <span>Add Category Budget</span>
        </button>
      </div>

      {categoryBudgets.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
          <p className="text-sm text-slate-500 mb-3">
            No category-specific budgets set for this month.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            + Set a category budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBudgets.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-base text-slate-900">{b.category}</h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        b.status === "exceeded"
                          ? "bg-rose-100 text-rose-700"
                          : b.status === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {b.percentage}%
                    </span>
                    <button
                      onClick={() => {
                        setBudgetToDelete(b);
                        setDeleteModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="Remove category budget"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Spent: {formatCurrency(b.spent)}</span>
                  <span>Limit: {formatCurrency(b.budget)}</span>
                </div>

                {/* Mini progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      b.status === "exceeded"
                        ? "bg-rose-500"
                        : b.status === "warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(b.percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Remaining:</span>
                <span
                  className={`font-bold ${
                    b.remaining >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formatCurrency(b.remaining)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Budget Setter Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveBudget}
        categories={categories}
        initialMonth={selectedMonth}
        initialYear={selectedYear}
        initialAmount={overall.budget || ""}
        loading={savingBudget}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBudgetToDelete(null);
        }}
        onConfirm={handleDeleteBudget}
        title="Remove Budget Target"
        message={`Are you sure you want to remove the budget target for "${budgetToDelete?.category}"?`}
        loading={deleting}
      />
    </Layout>
  );
};

export default Budgets;

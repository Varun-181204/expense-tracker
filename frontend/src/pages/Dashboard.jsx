import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaArrowRight,
  FaTag,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import TransactionModal from "../components/TransactionModal";
import { StatSkeleton, ChartSkeleton, TableSkeleton } from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { getDashboardData } from "../services/dashboardService";
import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionService";
import { formatCurrency, formatDate } from "../utils/formatters";
import { toast } from "react-toastify";

const PIE_COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#F97316", "#64748B"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [savingTransaction, setSavingTransaction] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashData, catData] = await Promise.all([
        getDashboardData(),
        getCategories(),
      ]);
      setData(dashData);
      setCategories(catData);
    } catch (err) {
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (formData) => {
    try {
      setSavingTransaction(true);
      await createTransaction(formData);
      toast.success("Transaction added successfully!");
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to add transaction");
    } finally {
      setSavingTransaction(false);
    }
  };

  const summary = data?.summary || {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    currentMonthExpense: 0,
    totalTransactions: 0,
  };

  const budget = data?.budget || null;
  const recentTransactions = data?.recentTransactions || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const monthlyTrends = data?.monthlyTrends || [];

  return (
    <Layout
      title="Financial Dashboard"
      subtitle="Real-time overview of your balances, expenses, and budget"
      onQuickAdd={() => setModalOpen(true)}
    >
      {/* Budget Alert Banner */}
      {budget && budget.budgetAmount > 0 && budget.isOverBudget && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4 text-rose-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 text-lg shrink-0">
              <FaExclamationTriangle />
            </div>
            <div>
              <h4 className="text-sm font-bold">Monthly Budget Exceeded!</h4>
              <p className="text-xs text-rose-600">
                You've spent {formatCurrency(budget.currentMonthExpense)} against your {formatCurrency(budget.budgetAmount)} monthly budget.
              </p>
            </div>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition shrink-0"
          >
            Adjust Budget
          </Link>
        </div>
      )}

      {budget && budget.budgetStatus === "warning" && !budget.isOverBudget && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4 text-amber-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-lg shrink-0">
              <FaExclamationTriangle />
            </div>
            <div>
              <h4 className="text-sm font-bold">Budget Warning ({budget.budgetPercentage}% Used)</h4>
              <p className="text-xs text-amber-700">
                Only {formatCurrency(budget.remainingBudget)} remaining in your overall budget for this month.
              </p>
            </div>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition shrink-0"
          >
            View Budgets
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatCard
            title="Total Balance"
            amount={formatCurrency(summary.totalBalance)}
            subtitle={`${summary.totalTransactions} all-time transactions`}
            icon={FaWallet}
            color="indigo"
          />
          <StatCard
            title="Total Income"
            amount={formatCurrency(summary.totalIncome)}
            subtitle="All-time earnings"
            icon={FaArrowUp}
            color="emerald"
          />
          <StatCard
            title="Total Expenses"
            amount={formatCurrency(summary.totalExpense)}
            subtitle="All-time spend"
            icon={FaArrowDown}
            color="rose"
          />
          <StatCard
            title="This Month's Spend"
            amount={formatCurrency(summary.currentMonthExpense)}
            subtitle={budget?.budgetAmount ? `Budget: ${formatCurrency(budget.budgetAmount)}` : "No budget set"}
            icon={FaCalendarAlt}
            color="purple"
            badge={budget?.budgetAmount ? `${budget.budgetPercentage}% used` : null}
          />
        </div>
      )}

      {/* Charts Section */}
      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <ChartSkeleton />
          </div>
          <div>
            <ChartSkeleton />
          </div>
        </div>
      ) : summary.totalTransactions === 0 ? (
        <div className="mb-8">
          <EmptyState
            title="No financial transactions yet"
            description="Add your first income or expense transaction to see live charts and spending trends."
            actionText="Add Transaction"
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Monthly Spending Trend Bar Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Income vs Expenses (Last 6 Months)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monthly cash flow comparison
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), ""]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category-wise Expense Visualization */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-bold text-base text-slate-900">
                Expense Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Spending by category
              </p>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-slate-400">
                No expense categories recorded yet
              </div>
            ) : (
              <>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value), "Spent"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-1">
                  {categoryBreakdown.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                        />
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your latest financial activity</p>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition"
          >
            <span>View All</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No transactions found. Click "+ Add Transaction" to get started!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx._id}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {isIncome ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{tx.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{formatDate(tx.date)}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium flex items-center gap-1">
                          <FaTag className="text-[8px]" />
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        isIncome ? "text-emerald-600" : "text-slate-900"
                      }`}
                    >
                      {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
        categories={categories}
        loading={savingTransaction}
      />
    </Layout>
  );
};

export default Dashboard;

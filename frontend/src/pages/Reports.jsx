import { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaFileCsv,
  FaPrint,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
import { StatSkeleton, ChartSkeleton } from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { getReports } from "../services/reportService";
import { formatCurrency } from "../utils/formatters";
import { toast } from "react-toastify";

const PIE_COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#F97316", "#64748B"];

const Reports = () => {
  const [timeRange, setTimeRange] = useState("this-month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = { timeRange };
      if (timeRange === "custom") {
        if (customStart) params.startDate = customStart;
        if (customEnd) params.endDate = customEnd;
      }
      const data = await getReports(params);
      setReportData(data);
    } catch (err) {
      toast.error(err.message || "Failed to load financial reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeRange !== "custom" || (customStart && customEnd)) {
      fetchReports();
    }
  }, [timeRange, customStart, customEnd]);

  const handleExportCSV = () => {
    if (!reportData || reportData.categoryExpenses.length === 0) {
      toast.info("No report data to export");
      return;
    }

    const headers = ["Category", "Total Spent", "Percentage of Expenses", "Transactions Count"];
    const rows = reportData.categoryExpenses.map((c) => [
      `"${c.category}"`,
      c.total,
      `${c.percentage}%`,
      c.count,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = reportData?.summary || {
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    savingsRate: 0,
    transactionCount: 0,
  };

  const categoryExpenses = reportData?.categoryExpenses || [];
  const monthlyTrends = reportData?.monthlyTrends || [];

  return (
    <Layout
      title="Financial Reports & Analytics"
      subtitle="Deep-dive into your financial performance, habits, and trends"
    >
      {/* Top Filter Bar & Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Quick Date Range Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "this-month", label: "This Month" },
              { id: "last-month", label: "Last Month" },
              { id: "last-6-months", label: "Last 6 Months" },
              { id: "this-year", label: "This Year" },
              { id: "all-time", label: "All Time" },
              { id: "custom", label: "Custom Range" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  timeRange === tab.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
            >
              <FaPrint className="text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
            >
              <FaFileCsv className="text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Custom Date Inputs if 'custom' is selected */}
        {timeRange === "custom" && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-500">Custom Date Interval:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="p-2 rounded-lg border border-slate-300 text-slate-800 bg-white font-medium"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="p-2 rounded-lg border border-slate-300 text-slate-800 bg-white font-medium"
            />
          </div>
        )}
      </div>

      {/* KPI Cards for Selected Period */}
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
            title="Total Income"
            amount={formatCurrency(summary.totalIncome)}
            subtitle="Earned in period"
            icon={FaArrowUp}
            color="emerald"
          />
          <StatCard
            title="Total Expenses"
            amount={formatCurrency(summary.totalExpense)}
            subtitle="Spent in period"
            icon={FaArrowDown}
            color="rose"
          />
          <StatCard
            title="Net Savings"
            amount={formatCurrency(summary.netSavings)}
            subtitle={`${summary.savingsRate}% of income saved`}
            icon={FaWallet}
            color="indigo"
          />
          <StatCard
            title="Activity Count"
            amount={summary.transactionCount}
            subtitle="Transactions logged"
            icon={FaCalendarAlt}
            color="purple"
          />
        </div>
      )}

      {/* Main Visualizations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <ChartSkeleton />
          </div>
          <div>
            <ChartSkeleton />
          </div>
        </div>
      ) : summary.transactionCount === 0 ? (
        <div className="mb-8">
          <EmptyState
            title="No activity recorded for this time range"
            description="Select a broader time range such as 'All Time' or 'This Year' to view your financial graphs."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Income vs Expenses Bar Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Income vs Expense Trends
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monthly cash comparison across the chosen timeframe
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), ""]} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-bold text-base text-slate-900">
                Expense by Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Proportion of expenditure
              </p>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="total"
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value), "Spent"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
              {categoryExpenses.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="text-slate-700 font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 mr-2">{formatCurrency(item.total)}</span>
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cumulative Net Savings Area Chart */}
          <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Monthly Net Savings Flow
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Surplus or deficit per month (Income minus Expenses)
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Net Balance"]} />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNet)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reports;
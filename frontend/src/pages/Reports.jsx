import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyChart from "../components/MonthlyChart";

import { getDashboard } from "../services/dashboardApi";
import { getCategorySummary } from "../services/chartApi";
import { getMonthlySummary } from "../services/monthlyApi";

import { exportPDF } from "../utils/exportPDF";
import { exportExcel } from "../utils/exportExcel";

import {
  FaMoneyBillWave,
  FaArrowDown,
  FaWallet,
  FaFileInvoiceDollar,
} from "react-icons/fa";

function Reports() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboard, setDashboard] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });

  const [categorySummary, setCategorySummary] = useState([]);

  const [monthlySummary, setMonthlySummary] = useState([]);

  // ---------------- Dashboard ----------------

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- Category Chart ----------------

  const loadCategorySummary = async () => {
    try {

      const data = await getCategorySummary();

      const chartData = data.map((item) => ({
        name: item._id,
        value: item.total,
      }));

      setCategorySummary(chartData);

    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- Monthly Chart ----------------

  const loadMonthlySummary = async () => {
    try {

      const data = await getMonthlySummary();

      const monthlyData = data.map((item) => ({
        month: `${item._id.month}/${item._id.year}`,
        income: item.income,
        expense: item.expense,
      }));

      setMonthlySummary(monthlyData);

    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- Load Everything ----------------

  useEffect(() => {

    loadDashboard();

    loadCategorySummary();

    loadMonthlySummary();

  }, []);

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6 lg:p-8">

        <div className="sticky top-0 bg-gray-100 z-20 pb-4">

          <Navbar
            setSidebarOpen={setSidebarOpen}
          />

        </div>

        {/* Hero Section */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl text-white p-8 mt-6 shadow-xl">

          <h1 className="text-4xl font-bold">
            Financial Reports
          </h1>

          <p className="mt-3 text-indigo-100 text-lg">
            Analyze your income, expenses and financial performance.
          </p>

        </div>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

            <FaMoneyBillWave className="text-green-500 text-4xl mb-4" />

            <p className="text-gray-500">
              Total Income
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              ₹{Number(dashboard.totalIncome).toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

            <FaArrowDown className="text-red-500 text-4xl mb-4" />

            <p className="text-gray-500">
              Total Expense
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-500">
              ₹{Number(dashboard.totalExpense).toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

            <FaWallet className="text-purple-600 text-4xl mb-4" />

            <p className="text-gray-500">
              Current Balance
            </p>

            <h2 className="text-3xl font-bold mt-2 text-purple-700">
              ₹{Number(dashboard.balance).toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

            <FaFileInvoiceDollar className="text-blue-500 text-4xl mb-4" />

            <p className="text-gray-500">
              Total Transactions
            </p>

            <h2 className="text-3xl font-bold mt-2 text-blue-600">
              {dashboard.transactionCount}
            </h2>

          </div>

        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Expense Breakdown
              </h2>

            </div>

            <ExpenseChart
              data={categorySummary}
            />

          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Monthly Income vs Expense
              </h2>

            </div>

            <MonthlyChart
              data={monthlySummary}
            />

          </div>

        </div>

        {/* Bottom Summary */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mt-8">

          <h2 className="text-2xl font-bold mb-6">
            Financial Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-green-50 rounded-2xl p-6">

              <h3 className="text-green-700 font-semibold">
                Income
              </h3>

              <p className="text-3xl font-bold mt-2">
                ₹{Number(dashboard.totalIncome).toLocaleString("en-IN")}
              </p>

            </div>

            <div className="bg-red-50 rounded-2xl p-6">

              <h3 className="text-red-700 font-semibold">
                Expense
              </h3>

              <p className="text-3xl font-bold mt-2">
                ₹{Number(dashboard.totalExpense).toLocaleString("en-IN")}
              </p>

            </div>

            <div className="bg-purple-50 rounded-2xl p-6">

              <h3 className="text-purple-700 font-semibold">
                Balance
              </h3>

              <p className="text-3xl font-bold mt-2">
                ₹{Number(dashboard.balance).toLocaleString("en-IN")}
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-4 mt-8">

          <button
           onClick={() => exportPDF(dashboard)}
           className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            📄 Export PDF
          </button>

          <button
             onClick={() => exportExcel(dashboard)}
             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            📊 Export Excel
          </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Reports;
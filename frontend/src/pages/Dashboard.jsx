import { getTransactions } from "../services/transactionApi";
import { getCategorySummary } from "../services/chartApi";
import { getMonthlySummary } from "../services/monthlyApi";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import RecentTransactions from "../components/RecentTransactions";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyChart from "../components/MonthlyChart";
import AddTransactionModal from "../components/AddTransactionModal";

import { getDashboard } from "../services/dashboardApi";

import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
} from "react-icons/fa";

function Dashboard() {

  const [dashboard, setDashboard] = useState({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  transactionCount: 0,
});

const [transactions, setTransactions] = useState([]);

const [categorySummary, setCategorySummary] = useState([]);

const [monthlySummary, setMonthlySummary] = useState([]);

const [showModal, setShowModal] = useState(false);

const [sidebarOpen, setSidebarOpen] = useState(false);

const loadDashboard = async () => {

    try {

        const data = await getDashboard();

        setDashboard(data);

    }

    catch(error){

        console.log(error);

    }

};

const loadTransactions = async () => {

    try {

        const data = await getTransactions();

        setTransactions(data);

    } catch (error) {

        console.log(error);

    }

};

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

const refreshDashboard = async () => {

    await Promise.all([
        loadDashboard(),
        loadTransactions(),
        loadCategorySummary(),
        loadMonthlySummary(),
    ]);

};

useEffect(() => {

    loadDashboard();

    loadTransactions();

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

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-5 md:p-8 mt-6 shadow-lg">

    <h1 className="text-2xl md:text-3xl font-bold">
        Welcome Back 👋
    </h1>

    <p className="mt-2 text-purple-100">
        Manage your income and expenses effortlessly.
    </p>

</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <SummaryCard
            title="Total Income"
            amount={dashboard.totalIncome}
            icon={<FaArrowUp />}
            color="bg-green-500"
          />

          <SummaryCard
            title="Total Expense"
            amount={dashboard.totalExpense}
            icon={<FaArrowDown />}
            color="bg-red-500"
          />

          <SummaryCard
            title="Balance"
            amount={dashboard.balance}
            icon={<FaWallet />}
            color="bg-blue-500"
          />

        </div>

{/* Charts + Recent Transactions */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

  {/* Expense Breakdown */}

  <div className="bg-white rounded-2xl shadow-md p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Expense Breakdown
      </h2>

      <button className="text-purple-600 font-semibold hover:text-purple-800">
        View Report
      </button>

    </div>

    <ExpenseChart
      data={categorySummary}
    />

  </div>

  {/* Recent Transactions */}

  <RecentTransactions
    transactions={transactions}
  />

</div>

{/* Monthly Chart */}

<div className="bg-white rounded-2xl shadow-md p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6">
    Monthly Income vs Expense
  </h2>

  <MonthlyChart
    data={monthlySummary}
  />

</div>

<button
  onClick={() => setShowModal(true)}
  className="fixed bottom-6 right-6 lg:left-1/2 lg:-translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-10 py-3 md:py-4 rounded-full shadow-2xl transition duration-300"
  >
     + Add Transaction
</button>

</div>


      <div className="mt-8 flex justify-center">

      </div>
      
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onTransactionAdded={refreshDashboard}
     />
    </div>

  );

}

export default Dashboard;
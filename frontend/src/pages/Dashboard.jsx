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

import { getAnalytics } from "../services/analyticsApi";

import {
  getBudget,
  setBudget as saveBudget
} from "../services/budgetApi";

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

const [budget, setBudget] = useState({
  budget: 0,
  spent: 0,
  remaining: 0,
});

const [showBudgetModal, setShowBudgetModal] = useState(false);

const [budgetAmount, setBudgetAmount] = useState("");

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
        loadAnalytics(),
        loadBudget(), 

    ]);

};

useEffect(() => {

    loadDashboard();

    loadTransactions();

    loadCategorySummary();

    loadMonthlySummary();

    loadAnalytics();

    loadBudget();

}, []);

const hour = new Date().getHours();

let greeting = "Good Evening";

if (hour < 12) {
  greeting = "Good Morning";
} else if (hour < 18) {
  greeting = "Good Afternoon";
}

const [analytics, setAnalytics] = useState({
  highestIncome: 0,
  highestExpense: 0,
  averageIncome: 0,
  averageExpense: 0,
  savingsRate: 0,
});


const loadBudget = async () => {

  try {

    const data = await getBudget();

    setBudget(data);

  } catch (error) {

    console.log(error);

  }

};

const handleSaveBudget = async () => {

  if (!budgetAmount || budgetAmount <= 0) {
    alert("Enter a valid budget");
    return;
  }

  try {

    await saveBudget({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: Number(budgetAmount),
  });

    await refreshDashboard();

    setShowBudgetModal(false);

    setBudgetAmount("");

  } catch (error) {

    console.log(error);

  }

};

const loadAnalytics = async () => {
  try {

    const data = await getAnalytics();

    setAnalytics(data);

  } catch (error) {

    console.log(error);

  }
};


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
              📊 Financial Dashboard
            </h1>

             <p className="mt-2 text-purple-100">
               Monitor your income, expenses and savings with real-time insights.
             </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <SummaryCard
            title="Total Income"
            amount={dashboard.totalIncome}
            icon={<FaArrowUp />}
            color="bg-gradient-to-r from-green-500 to-emerald-600"
          />

          <SummaryCard
            title="Total Expense"
            amount={dashboard.totalExpense}
            icon={<FaArrowDown />}
            color="bg-gradient-to-r from-green-500 to-emerald-600"
          />

          <SummaryCard
            title="Balance"
            amount={dashboard.balance}
            icon={<FaWallet />}
            color="bg-gradient-to-r from-green-500 to-emerald-600"
          />

        </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">

  <div className="bg-white rounded-2xl shadow-md p-5">
    <h3 className="text-gray-500 text-sm">
      Transactions
    </h3>

    <p className="text-3xl font-bold mt-2">
      {dashboard.transactionCount}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-md p-5">
    <h3 className="text-gray-500 text-sm">
      Highest Income
    </h3>

    <p className="text-3xl font-bold text-green-600 mt-2">
      ₹{Number(analytics.highestIncome).toLocaleString("en-IN")}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-md p-5">
    <h3 className="text-gray-500 text-sm">
      Highest Expense
    </h3>

    <p className="text-3xl font-bold text-red-600 mt-2">
      ₹{Number(analytics.highestExpense).toLocaleString("en-IN")}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-md p-5">
    <h3 className="text-gray-500 text-sm">
      Average Expense
    </h3>

    <p className="text-3xl font-bold text-orange-500 mt-2">
      ₹{Number(analytics.averageExpense).toLocaleString("en-IN")}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-md p-5">
    <h3 className="text-gray-500 text-sm">
      Savings Rate
    </h3>

    <p className="text-3xl font-bold text-purple-600 mt-2">
      {analytics.savingsRate.toFixed(1)}%
    </p>
  </div>

</div>

<div className="bg-white rounded-2xl shadow-md p-6 mt-6">

  <div className="flex justify-between items-center mb-4">

    <h2 className="text-2xl font-bold">
      Monthly Budget
    </h2>

    <button
      onClick={() => setShowBudgetModal(true)}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
    >
        Set Budget
    </button>

    <span className="text-purple-600 font-semibold">
      ₹{Number(budget?.remaining || 0).toLocaleString("en-IN")}
    </span>

  </div>

  <div className="w-full bg-gray-200 rounded-full h-4">

    <div
      className={`h-4 rounded-full ${
        budget.spent > budget.budget
          ? "bg-red-500"
          : "bg-green-500"
      }`}
      style={{
        width: `${
          budget.budget > 0
            ? Math.min(
                (budget.spent / budget.budget) * 100,
                100
              )
            : 0
        }%`,
      }}
    ></div>

  </div>

  <div className="grid grid-cols-3 gap-4 mt-6 text-center">

    <div>

      <p className="text-gray-500 text-sm">
        Budget
      </p>

      <h3 className="font-bold text-lg">
        ₹{Number(budget.budget || 0).toLocaleString("en-IN")}
      </h3>

    </div>

    <div>

      <p className="text-gray-500 text-sm">
        Spent
      </p>

      <h3 className="font-bold text-red-500 text-lg">
        ₹{Number(budget.spent || 0).toLocaleString("en-IN")}
      </h3>

    </div>

    <div>

      <p className="text-gray-500 text-sm">
        Remaining
      </p>

      <h3 className="font-bold text-green-600 text-lg">
        ₹{Number(budget.remaining || 0).toLocaleString("en-IN")}
      </h3>

    </div>

  </div>

</div>

{/* Charts + Recent Transactions */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

  {/* Expense Breakdown */}

  <div className=" bg-white rounded-3xl shadow-lg borderborder-gray-100p-6hover:shadow-2xltransition-allduration-300">

    <div className="flex items-center justify-between mb-6">

     <div>

      <h2 className="text-2xl font-bold text-gray-800">
         Expense Breakdown
      </h2>

      <p className="text-gray-500 text-sm mt-1">
         Category-wise expense distribution
      </p>

     </div>

    <button
      className="text-purple-600 hover:text-purple-800 font-semibold transition"
        >
        View Report →
    </button>

</div>

    <div className="h-[350px]">
  <ExpenseChart data={categorySummary} />
</div>

  </div>

  {/* Recent Transactions */}

  <RecentTransactions
    transactions={transactions}
  />

</div>

{/* Monthly Chart */}

  <div className=" bg-white rounded-3xl shadow-lg borderborder-gray-100p-6hover:shadow-2xltransition-allduration-300">

  <h2 className="text-2xl font-bold mb-6">
    Monthly Income vs Expense
  </h2>

  <div className="h-[350px]">
  <MonthlyChart data={monthlySummary} />
</div>

</div>

{showBudgetModal && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-96">

      <h2 className="text-2xl font-bold mb-6">
        Set Monthly Budget
      </h2>

      <input
        type="number"
        placeholder="Enter Budget"
        value={budgetAmount}
        onChange={(e) => setBudgetAmount(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 mb-6"
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowBudgetModal(false)}
          className="px-5 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveBudget}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
        >
          Save
        </button>

      </div>

    </div>

  </div>

)}

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
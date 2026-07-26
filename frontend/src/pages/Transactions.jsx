import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import {
    getTransactions,
    deleteTransaction,
} from "../services/transactionApi";
import EditTransactionModal from "../components/EditTransactionModal";
import { toast } from "react-toastify";
import AddTransactionModal from "../components/AddTransactionModal";

function Transactions() {

const [transactions, setTransactions] = useState([]);

const [search, setSearch] = useState("");
const [typeFilter, setTypeFilter] = useState("All");

const [categoryFilter, setCategoryFilter] = useState("All");
const [dateFilter, setDateFilter] = useState("");

const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedTransaction, setSelectedTransaction] = useState(null);

const [sortBy, setSortBy] = useState("newest");

const [currentPage, setCurrentPage] = useState(1);

const [showAddModal, setShowAddModal] = useState(false);

const [loading, setLoading] = useState(true);

const transactionsPerPage = 10;

const loadTransactions = async () => {

  try {

    setLoading(true);

    const data = await getTransactions();

    setTransactions(data);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

};

useEffect(() => {

  loadTransactions();

}, []);

const handleEdit = (transaction) => {

    setSelectedTransaction(transaction);

    setIsEditOpen(true);

};

const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {

        await deleteTransaction(id);

        toast.success("Transaction deleted successfully");

        loadTransactions();

        setCurrentPage(1);

    } catch (error) {

        console.log(error);

        toast.error("Failed to delete transaction");

    }

};

const categories = [
  "All",
  ...new Set(transactions.map((transaction) => transaction.category)),
];

const filteredTransactions = transactions.filter((transaction) => {

  const keyword = search.toLowerCase();

  const matchesSearch =
    transaction.title.toLowerCase().includes(keyword) ||
    transaction.category.toLowerCase().includes(keyword) ||
    transaction.type.toLowerCase().includes(keyword);

  const matchesType =
    typeFilter === "All" ||
    transaction.type === typeFilter;

  const matchesCategory =
    categoryFilter === "All" ||
    transaction.category === categoryFilter;

  const matchesDate =
    !dateFilter ||
    transaction.date.slice(0, 10) === dateFilter;

  return (
    matchesSearch &&
    matchesType &&
    matchesCategory &&
    matchesDate
  );

});

const sortedTransactions = [...filteredTransactions].sort((a, b) => {

  switch (sortBy) {

    case "newest":
      return new Date(b.date) - new Date(a.date);

    case "oldest":
      return new Date(a.date) - new Date(b.date);

    case "high":
      return b.amount - a.amount;

    case "low":
      return a.amount - b.amount;

    default:
      return 0;

  }

});

const indexOfLastTransaction =
  currentPage * transactionsPerPage;

const indexOfFirstTransaction =
  indexOfLastTransaction - transactionsPerPage;

const currentTransactions =
  sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

const totalPages = Math.ceil(
  sortedTransactions.length / transactionsPerPage
);

useEffect(() => {
  setCurrentPage(1);
}, [search, typeFilter, categoryFilter, dateFilter, sortBy]);

if (loading) {

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="text-center">

        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>

        <p className="mt-4 text-gray-600 font-medium">
          Loading Transactions...
        </p>

      </div>

    </div>

  );

}  

return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4 md:p-6 lg:p-8">

        <Navbar />

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">

          <div className="flex justify-between items-center mb-6">

            <h1 className="text-3xl font-bold">
              Transactions
            </h1>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
            >
              + Add Transaction
            </button>

          </div>

          <div className="flex flex-wrap gap-4 mb-6">

  <input
    type="text"
    placeholder="Search transactions..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  />

  <select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
    className="flex-1 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="All">All Types</option>
    <option value="Income">Income</option>
    <option value="Expense">Expense</option>
  </select>

  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="flex-1 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    {categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>

  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="flex-1 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  />

  <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border rounded-xl px-4 py-2"
>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
  <option value="high">Highest Amount</option>
  <option value="low">Lowest Amount</option>
</select>
</div>
<div className="overflow-x-auto">

  {sortedTransactions.length === 0 ? (

    <div className="bg-white rounded-xl p-10 text-center">

      <div className="text-6xl mb-5">💸</div>

      <h2 className="text-xl font-bold">
        No Transactions Yet......
      </h2>

      <p className="text-gray-500 mt-2">
        Start tracking your finances by adding your first transaction.
      </p>

    </div>

  ) : (

    currentTransactions.map((transaction) => (

      <div
        key={transaction._id}
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 mb-4 border border-gray-100"
      >

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

          <div>

            <h2 className="font-bold text-xl">
              {transaction.title}
            </h2>

            <p className="text-gray-500">
              {transaction.category}
            </p>

            <p className="text-gray-400 text-sm">
              {new Date(transaction.date).toLocaleDateString()}
            </p>

          </div>

          <div className="text-right">

            <h2
              className={`font-bold text-2xl ${
                transaction.type === "Income"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              ₹{transaction.amount.toLocaleString()}
            </h2>

            <div className="flex gap-3 mt-3 justify-end">

              <button
                onClick={() => handleEdit(transaction)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(transaction._id)}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      </div>

    ))

  )}



<div className="flex justify-center items-center gap-3 mt-8 flex-wrap">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className={`px-4 py-2 rounded-lg ${
      currentPage === 1
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-purple-600 text-white hover:bg-purple-700"
    }`}
  >
    Previous
  </button>

  {Array.from({ length: totalPages }, (_, index) => (

    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      className={`w-11 h-11 rounded-full ${
        currentPage === index + 1
          ? "bg-purple-600 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {index + 1}
    </button>

  ))}

  <button
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage(currentPage + 1)}
    className={`px-4 py-2 rounded-lg ${
      currentPage === totalPages || totalPages === 0
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-purple-600 text-white hover:bg-purple-700"
    }`}
  >
    Next
  </button>

</div>

</div>

</div>
  
</div>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTransactionAdded={() => {
          loadTransactions();
          setCurrentPage(1);
        }}
      />
      <EditTransactionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        transaction={selectedTransaction}
        onUpdated={() => {
          loadTransactions();
          setCurrentPage(1);
        }}
      />
    </div>

  );

}

export default Transactions;
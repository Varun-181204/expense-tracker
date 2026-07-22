import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import {
    getTransactions,
    deleteTransaction,
} from "../services/transactionApi";
import EditTransactionModal from "../components/EditTransactionModal";
import { toast } from "react-toastify";

function Transactions() {

const [transactions, setTransactions] = useState([]);

const [search, setSearch] = useState("");
const [typeFilter, setTypeFilter] = useState("All");

const [categoryFilter, setCategoryFilter] = useState("All");
const [dateFilter, setDateFilter] = useState("");

const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedTransaction, setSelectedTransaction] = useState(null);

  const loadTransactions = async () => {

    try {

      const data = await getTransactions();

      setTransactions(data);

    } catch (error) {

      console.log(error);

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

        toast.success("Transaction Deleted!");

        loadTransactions();

    } catch (error) {

        console.log(error);

        alert("Delete Failed");

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

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        <Navbar />

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">

          <div className="flex justify-between items-center mb-6">

            <h1 className="text-3xl font-bold">
              Transactions
            </h1>

            <button className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700">
              + Add Transaction
            </button>

          </div>

          <div className="flex gap-4 mb-6">

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

</div>

    <div className="overflow-x-auto">

      <div className="overflow-x-auto">

  {filteredTransactions.length === 0 ? (

    <div className="bg-white rounded-xl p-10 text-center">

      <div className="text-5xl mb-4">📭</div>

      <h2 className="text-xl font-bold">
        No Transactions Found
      </h2>

      <p className="text-gray-500 mt-2">
        Add your first transaction.
      </p>

    </div>

  ) : (

    filteredTransactions.map((transaction) => (

      <div
        key={transaction._id}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 mb-4"
      >

        <div className="flex justify-between items-center">

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
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(transaction._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      </div>

    ))

  )}

</div>

</div>

</div>
  
</div>

      <EditTransactionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        transaction={selectedTransaction}
        onUpdated={loadTransactions}
      />
    </div>

  );

}

export default Transactions;
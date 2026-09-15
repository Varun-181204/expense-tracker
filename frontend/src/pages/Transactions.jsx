import { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaTag,
  FaFileCsv,
} from "react-icons/fa";
import Layout from "../components/Layout";
import TransactionModal from "../components/TransactionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { TableSkeleton } from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import { formatCurrency, formatDate } from "../utils/formatters";
import { toast } from "react-toastify";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [savingTransaction, setSavingTransaction] = useState(false);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Categories fetch error:", err.message);
    }
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (typeFilter !== "all") params.type = typeFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (sortBy) params.sortBy = sortBy;

      const data = await getTransactions(params);
      setTransactions(data.transactions || []);
    } catch (err) {
      toast.error(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, categoryFilter, startDate, endDate, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTransactions]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSavingTransaction(true);
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, formData);
        toast.success("Transaction updated successfully!");
      } else {
        await createTransaction(formData);
        toast.success("Transaction created successfully!");
      }
      setModalOpen(false);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      toast.error(err.message || "Failed to save transaction");
    } finally {
      setSavingTransaction(false);
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    try {
      setDeleting(true);
      await deleteTransaction(transactionToDelete._id);
      toast.success("Transaction removed");
      setDeleteModalOpen(false);
      setTransactionToDelete(null);
      fetchTransactions();
    } catch (err) {
      toast.error(err.message || "Failed to delete transaction");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.info("No transactions to export");
      return;
    }

    const headers = ["Title", "Type", "Amount", "Category", "Date", "Description"];
    const rows = transactions.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      `"${t.category.replace(/"/g, '""')}"`,
      new Date(t.date).toISOString().split("T")[0],
      `"${(t.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Computed summary for filtered view
  const filteredIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout
      title="Transactions"
      subtitle="View, search, and manage all your income and expenses"
      onQuickAdd={() => {
        setEditingTransaction(null);
        setModalOpen(true);
      }}
    >
      {/* Top Filter Bar & Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FaSearch />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, or notes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition cursor-pointer"
            >
              <FaFileCsv className="text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setEditingTransaction(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition cursor-pointer"
            >
              <FaPlus />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Multi-Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Type Filter */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 bg-white font-medium"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 bg-white font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 bg-white font-medium"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 bg-white font-medium"
            />
          </div>

          {/* Sort By */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-slate-500 font-semibold mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 bg-white font-medium"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Tags */}
        {(typeFilter !== "all" || categoryFilter !== "all" || startDate || endDate || search) && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>
              Found <strong>{transactions.length}</strong> matching transactions
            </span>
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setCategoryFilter("all");
                setStartDate("");
                setEndDate("");
                setSortBy("date_desc");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filtered KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Filtered Income</p>
            <h4 className="text-lg font-bold text-emerald-600 mt-0.5">
              +{formatCurrency(filteredIncome)}
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
            <FaArrowUp />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Filtered Expenses</p>
            <h4 className="text-lg font-bold text-rose-600 mt-0.5">
              -{formatCurrency(filteredExpense)}
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
            <FaArrowDown />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Net for Filtered Period</p>
            <h4
              className={`text-lg font-bold mt-0.5 ${
                filteredIncome - filteredExpense >= 0 ? "text-indigo-600" : "text-rose-600"
              }`}
            >
              {formatCurrency(filteredIncome - filteredExpense)}
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
            <FaFilter />
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions match your criteria"
            description="Try clearing some search terms or filters, or add a new transaction."
            actionText="Add Transaction"
            onAction={() => {
              setEditingTransaction(null);
              setModalOpen(true);
            }}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Transaction</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6 text-right">Amount</th>
                    <th className="py-3.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {transactions.map((tx) => {
                    const isIncome = tx.type === "income";
                    return (
                      <tr key={tx._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                                isIncome
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {isIncome ? <FaArrowUp /> : <FaArrowDown />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">
                                {tx.title}
                              </p>
                              {tx.description && (
                                <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                                  {tx.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                            <FaTag className="text-[10px] text-slate-400" />
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                          {formatDate(tx.date)}
                        </td>
                        <td className="py-4 px-6 text-right font-bold">
                          <span
                            className={
                              isIncome ? "text-emerald-600" : "text-slate-900"
                            }
                          >
                            {isIncome ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingTransaction(tx);
                                setModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                              title="Edit transaction"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => {
                                setTransactionToDelete(tx);
                                setDeleteModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete transaction"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isIncome = tx.type === "income";
                return (
                  <div key={tx._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {isIncome ? <FaArrowUp /> : <FaArrowDown />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">
                            {tx.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatDate(tx.date)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          isIncome ? "text-emerald-600" : "text-slate-900"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {tx.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setModalOpen(true);
                          }}
                          className="text-indigo-600 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setTransactionToDelete(tx);
                            setDeleteModalOpen(true);
                          }}
                          className="text-rose-600 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Transaction Modal (Add/Edit) */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTransaction}
        categories={categories}
        loading={savingTransaction}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transactionToDelete?.title}" (${formatCurrency(
          transactionToDelete?.amount
        )})? This cannot be undone.`}
        loading={deleting}
      />
    </Layout>
  );
};

export default Transactions;

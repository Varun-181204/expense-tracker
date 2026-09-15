import { useState, useEffect } from "react";
import { FaPlus, FaTags, FaEdit, FaTrash } from "react-icons/fa";
import Layout from "../components/Layout";
import CategoryModal from "../components/CategoryModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { TableSkeleton } from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expense"); // "expense" | "income"

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (formData) => {
    try {
      setSavingCategory(true);
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData);
        toast.success("New category added!");
      }
      setModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await deleteCategory(categoryToDelete._id);
      toast.success("Category deleted");
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === activeTab);
  const expenseCount = categories.filter((c) => c.type === "expense").length;
  const incomeCount = categories.filter((c) => c.type === "income").length;

  return (
    <Layout
      title="Categories"
      subtitle="Organize your financial transactions with custom categories"
      onQuickAdd={() => {
        setEditingCategory(null);
        setModalOpen(true);
      }}
    >
      {/* Tab Switcher & New Category Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 p-1 bg-slate-200/70 rounded-xl max-w-sm">
          <button
            onClick={() => setActiveTab("expense")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === "expense"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Expense Categories ({expenseCount})
          </button>
          <button
            onClick={() => setActiveTab("income")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === "income"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Income Categories ({incomeCount})
          </button>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition cursor-pointer"
        >
          <FaPlus />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} categories found`}
          description={`Add your first custom ${activeTab} category to classify your expenses or earnings.`}
          actionText="Create Category"
          onAction={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg shadow-xs"
                    style={{ backgroundColor: cat.color || "#6366F1" }}
                  >
                    <FaTags />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{cat.name}</h4>
                    <span className="text-[11px] font-medium text-slate-400 capitalize">
                      {cat.type} Category
                    </span>
                  </div>
                </div>

                {cat.isDefault && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider"
                    title="System default category"
                  >
                    Default
                  </span>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.color}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                    title="Edit category"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(cat);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSave}
        initialData={editingCategory}
        loading={savingCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the "${categoryToDelete?.name}" category? Existing transactions with this category will be reassigned to "Other".`}
        loading={deleting}
      />
    </Layout>
  );
};

export default Categories;
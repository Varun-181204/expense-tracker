import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-rose-600">
            <FaExclamationTriangle className="text-xl" />
            <h3 className="font-bold text-lg text-slate-900">{title || "Confirm Deletion"}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-slate-600 text-sm mt-4 leading-relaxed">
          {message || "Are you sure you want to delete this item? This action cannot be undone."}
        </p>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

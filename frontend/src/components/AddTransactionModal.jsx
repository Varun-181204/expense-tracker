import { useState } from "react";
import { addTransaction } from "../services/transactionApi";
import { toast } from "react-toastify";

function AddTransactionModal({
    isOpen,
    onClose,
    onTransactionAdded,
})
 {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "Expense",
    category: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    await addTransaction(formData);

    onTransactionAdded();

    setFormData({
      title: "",
      amount: "",
      type: "Expense",
      category: "",
      date: "",
    }); 

    toast.success("Transaction Added Successfully!");

    onClose();

  } catch (error) {

    console.log(error);

     toast.error("Failed to add transaction");

  }

};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white rounded-xl p-6 w-[420px]">

        <h2 className="text-2xl font-bold mb-6">
          Add Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option>Expense</option>
            <option>Income</option>
          </select>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-purple-600 text-white"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddTransactionModal;

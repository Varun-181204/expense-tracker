import { useEffect, useState } from "react";
import { updateTransaction } from "../services/transactionApi";
import { toast } from "react-toastify";


function EditTransactionModal({
    isOpen,
    onClose,
    transaction,
    onUpdated,
}) {

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "Expense",
    date: "",
  });

  useEffect(() => {

    if (transaction) {

      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        date: transaction.date.slice(0, 10),
      });

    }

  }, [transaction]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  if (!isOpen) return null;

  const handleUpdate = async () => {

    try {

        await updateTransaction(
            transaction._id,
            formData
        );

        toast.success("Transaction Updated!");

        onUpdated();

        onClose();

    } catch (error) {

        console.log(error);

            toast.error("Update Failed");

    }

};

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white p-6 rounded-xl w-[450px]">

        <h2 className="text-2xl font-bold mb-6">
          Edit Transaction
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option>Income</option>
            <option>Expense</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="bg-gray-300 px-5 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
             onClick={handleUpdate}
             className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700">
               Update
          </button>

        </div>

      </div>

    </div>

  );

}

export default EditTransactionModal;
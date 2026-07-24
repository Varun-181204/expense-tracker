import { useEffect, useState } from "react";
import {
  FaUtensils,
  FaShoppingBag,
  FaPlane,
  FaMoneyBillWave,
  FaFilm,
  FaBook,
  FaHeartbeat,
  FaHome,
  FaQuestion,
} from "react-icons/fa";

function RecentTransactions({ transactions }) {

  const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "food":
      return <FaUtensils />;
    case "shopping":
      return <FaShoppingBag />;
    case "travel":
      return <FaPlane />;
    case "salary":
      return <FaMoneyBillWave />;
    case "entertainment":
      return <FaFilm />;
    case "education":
      return <FaBook />;
    case "health":
      return <FaHeartbeat />;
    case "house":
    case "rent":
      return <FaHome />;
    default:
      return <FaQuestion />;
  }
};

  return (

    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

     <div className="flex justify-between items-center mb-5">

  <h2 className="text-2xl font-bold">
    Recent Transactions
  </h2>

  <button className="text-purple-600 font-semibold hover:text-purple-800">
    View All
  </button>

</div>

      {transactions.length === 0 ? (

<div className="text-center py-12">

  <div className="text-6xl mb-4">
    📄
  </div>

  <h3 className="text-xl font-semibold text-gray-700">
    No Transactions Yet
  </h3>

  <p className="text-gray-500 mt-2">
    Add your first transaction to start tracking your finances.
  </p>

</div>

      ) : (

        transactions.slice(0, 5).map((item) => (

 <div
  key={item._id}
  className="flex justify-between items-center p-4 mb-3 rounded-2xl border border-gray-100 hover:bg-purple-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
>

    {/* Left Side */}
    <div className="flex items-center gap-4">

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${
          item.type === "Income"
            ? "bg-gradient-to-r from-green-500 to-emerald-600"
            : "bg-gradient-to-r from-red-500 to-rose-600"
        }`}
      >
        {getCategoryIcon(item.category)}
      </div>

      <div>

        <h3 className="font-semibold text-gray-800">
          {item.title}
        </h3>

        <p className="text-gray-500 text-sm">
          {item.category} •{" "}
          {new Date(item.date).toLocaleDateString("en-IN")}
        </p>

      </div>

    </div>

    {/* Right Side */}
    <h3
      className={`font-bold text-lg ${
        item.type === "Income"
          ? "text-green-600"
          : "text-red-500"
      }`}
    >
      {item.type === "Income" ? "+" : "-"}₹
      {Number(item.amount).toLocaleString("en-IN")}
    </h3>

  </div>

))

      )}

    </div>

  );

}

export default RecentTransactions;
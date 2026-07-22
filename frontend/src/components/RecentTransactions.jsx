import { useEffect, useState } from "react";

function RecentTransactions({ transactions }) {


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

        <p className="text-gray-500">
          No Transactions Found
        </p>

      ) : (

        transactions.slice(0, 5).map((item) => (

  <div
    key={item._id}
    className="flex justify-between items-center py-4 px-2 border-b last:border-none hover:bg-gray-50 rounded-xl transition-all duration-200"
  >

    {/* Left Side */}
    <div className="flex items-center gap-4">

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${
          item.type === "Income"
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      >
        {item.type === "Income" ? "↑" : "↓"}
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
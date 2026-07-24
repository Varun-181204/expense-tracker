import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getCategorySummary } from "../services/categoryApi";


function Categories() {

  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
  try {
    const data = await getCategorySummary();

    setCategories(data);

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadCategories();
}, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 p-8">
        <Navbar />

        <div className="mt-8">

  <h1 className="text-3xl font-bold mb-2">
    Categories
  </h1>

  <p className="text-gray-500 mb-8">
    Expense summary by category
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

    {categories.map((item) => (

      <div
        key={item.category}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"
      >

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-xl font-bold capitalize">
              {item.category}
            </h2>

            <p className="text-gray-500 mt-2">
              Total Expense
            </p>

          </div>

          <div className="text-4xl">
            📂
          </div>

        </div>

        <h1 className="text-3xl font-bold text-red-500 mt-6">
          ₹{item.total.toLocaleString("en-IN")}
        </h1>

      </div>

    ))}

  </div>

</div>

      </div>
    </div>
  );
}

export default Categories;
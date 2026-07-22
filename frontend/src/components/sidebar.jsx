import {
  FaHome,
  FaExchangeAlt,
  FaList,
  FaChartPie,
  FaCog,
} from "react-icons/fa";
import { FaBars, FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getProfile } from "../services/profileApi";

import { NavLink } from "react-router-dom";

function Sidebar({
    sidebarOpen,
    setSidebarOpen,
}) {

  const [user, setUser] = useState({
  name: "",
  email: "",
});

useEffect(() => {

  const loadProfile = async () => {

    try {

      const data = await getProfile();

      setUser(data);

    } catch (error) {

      console.log(error);

    }

  };

  loadProfile();

}, []);

  return (
      <div className={`
fixed
top-0
left-0
z-50
h-screen
w-72
bg-white
shadow-xl
transform
transition-transform
duration-300
lg:translate-x-0
lg:static
lg:flex
flex-col
justify-between
${
sidebarOpen
? "translate-x-0"
: "-translate-x-full"
}
`}
>
      {/* Top Section */}
      <div>

        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b">

          <div className="bg-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
            💼
          </div>

          <div>
            <h1 className="text-2xl font-bold">Expense Tracker</h1>

            <p className="text-gray-500 text-sm">
              Personal Finance
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl"
            >

              ✕
          </button>

        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-2">

          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FaHome />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/transactions"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FaExchangeAlt />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/categories"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FaList />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/reports"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FaChartPie />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FaCog />
            <span>Settings</span>
          </NavLink>

        </nav>

      </div>

      {/* Bottom User Section */}
      <div className="border-t p-5">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h3 className="font-semibold">
              {user.name}
            </h3>

            <p className="text-gray-500 text-sm">
              {user.email}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;
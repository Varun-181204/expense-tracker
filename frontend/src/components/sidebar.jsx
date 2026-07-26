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
  profileImage: "",
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
bg-gray-50
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
  <div className="flex items-center gap-4 p-6 border-b border-gray-200">

  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">

    <span className="text-2xl">💰</span>

  </div>

  <div>

    <div className="flex flex-col items-center mb-8">

  <img
    src={
      user.profileImage
        ? user.profileImage
        : `https://ui-avatars.com/api/?name=${user.name}`
    }
    alt="Profile"
    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
  />

  <h2 className="mt-4 text-lg font-bold text-white">
    {user.name}
  </h2>

  <p className="text-sm text-purple-200">
    {user.email}
  </p>

</div>

    <p className="text-sm text-gray-500">
      Personal Finance
    </p>

  </div>


   <button
   onClick={() => setSidebarOpen(false)}
   className="lg:hidden text-2xl">
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
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:translate-x-1"
              }`
            }
          >
            <FaHome className="text-lg" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/transactions"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
               ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold"
               : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:translate-x-1"
             }`
           }
          >
            <FaExchangeAlt className="text-lg" />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/categories"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:translate-x-1"
              }`
            }
          >
            <FaList className="text-lg" />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/reports"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:translate-x-1"
              }`
            }
          >
            <FaChartPie className="text-lg" />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:translate-x-1"
              }`
            }
          >
            <FaCog className="text-lg" />
            <span>Settings</span>
          </NavLink>

        </nav>

      </div>

      {/* Bottom User Section */}
      <div className="border-t border-gray-200 p-6 bg-white">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h3 className="font-semibold">
              {user.name}
            </h3>

            <p className="text-gray-500 text-sm">
              {user.email}
            </p>

            <div className="flex items-center gap-2 mt-1">

       <div className="w-2 h-2 bg-green-500 rounded-full"></div>

        <p className="text-xs text-green-600">
          Online
        </p>
       </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;
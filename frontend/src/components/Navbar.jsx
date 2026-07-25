import {
  FaBell,
  FaBars,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/profileApi";
import { useNotification } from "../context/NotificationContext";


function Navbar({
    setSidebarOpen,
}) {

  const navigate = useNavigate();

  const [user, setUser] = useState({
  name: "",
  email: "",
});

const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

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

const {
  notifications,
  clearNotifications,
} = useNotification();

  return (

    <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">

      {/* Left */}

      <div className="flex items-center gap-4">

    <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-2xl"
    >
        <FaBars />
    </button>

    <div>

      <h1 className="text-3xl font-bold text-gray-800">
        Welcome Back
      {user.name
        ? `, ${user.name.charAt(0).toUpperCase() + user.name.slice(1)}`
        : ""}{" "}
         👋
      </h1>

    <p className="text-gray-500 mt-2">
        Manage your personal finances with confidence.
    </p>

    </div>

</div>

{/* Right */}

<div className="flex items-center gap-4">

<div className="relative">

  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="
      w-12
      h-12
      rounded-full
      bg-gray-100
      flex
      items-center
      justify-center
      hover:bg-purple-100
      transition
    "
  >
    <FaBell className="text-xl text-gray-700" />
  </button>

  {notifications.length > 0 && (
  <span
    className="
    absolute
    -top-1
    -right-1
    bg-red-500
    text-white
    text-[10px]
    font-bold
    rounded-full
    w-5
    h-5
    flex
    items-center
    justify-center
    "
  >
    {notifications.length}
  </span>
)}

  {showNotifications && (
    <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-lg">
          Notifications
        </h2>

        <button
          onClick={() => setShowNotifications(false)}
          className="text-gray-500 hover:text-red-500"
        >
          <FaTimes />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y">

        {notifications.length === 0 ? (

        <div className="p-8 text-center">

        <div className="text-5xl mb-3">
          🔔
        </div>

        <p className="text-gray-500">
          No Notifications
        </p>

      </div>

      ) : (

        notifications.map((item) => (

          <div
            key={item.id}
            className="p-4 hover:bg-purple-50 transition cursor-pointer"
          >
            <h3 className="font-semibold text-gray-800">
              {item.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {item.message}
            </p>

          </div>

        ))
      )}

      </div>

    </div>
  )}

</div>

  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
  >
    <FaSignOutAlt />
    Logout
  </button>

</div>

    </div>

  );

}

export default Navbar;
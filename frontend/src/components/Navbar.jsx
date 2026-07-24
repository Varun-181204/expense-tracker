import { FaBell, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/profileApi";

function Navbar({
    setSidebarOpen,
}) {

  const navigate = useNavigate();

  const [user, setUser] = useState({
  name: "",
  email: "",
});


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

    <span
      className="
      absolute
      top-1
      right-1
      w-3
      h-3
      bg-red-500
      rounded-full
      "
    ></span>

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
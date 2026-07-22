import { FaBell, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar({
    setSidebarOpen,
}) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

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

        <h1 className="text-3xl font-bold">
            Good Morning 👋
        </h1>

        <p className="text-gray-500 mt-2">
            Here's your financial overview
        </p>

    </div>

</div>

      {/* Right */}

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

          <FaBell className="text-xl text-gray-700"/>

        </button>

        <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
        <FaSignOutAlt />
           Logout
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

    </div>

  );

}

export default Navbar;
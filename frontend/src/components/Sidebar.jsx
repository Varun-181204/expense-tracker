import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaExchangeAlt,
  FaTags,
  FaBullseye,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaWallet,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/dashboard", name: "Dashboard", icon: FaChartPie },
  { to: "/transactions", name: "Transactions", icon: FaExchangeAlt },
  { to: "/categories", name: "Categories", icon: FaTags },
  { to: "/budgets", name: "Budgets", icon: FaBullseye },
  { to: "/reports", name: "Reports", icon: FaFileAlt },
  { to: "/settings", name: "Settings", icon: FaCog },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-100 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg shadow-md shadow-indigo-600/30">
                <FaWallet />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">ExpenseTrack</h1>
                <p className="text-[11px] font-medium text-slate-400">Finance Manager</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-sm">
              {userInitial}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition duration-150 cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

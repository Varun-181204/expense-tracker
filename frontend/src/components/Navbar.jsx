import { FaBars, FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onOpenSidebar, title, subtitle, onQuickAdd }) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open menu"
        >
          <FaBars className="text-xl" />
        </button>

        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onQuickAdd && (
          <button
            onClick={onQuickAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <FaPlus className="text-xs" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-slate-700">
            Hi, {firstName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

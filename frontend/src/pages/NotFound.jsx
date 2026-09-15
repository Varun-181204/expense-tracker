import { Link } from "react-router-dom";
import { FaHome, FaQuestionCircle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center text-3xl mb-4">
          <FaQuestionCircle />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
        >
          <FaHome />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

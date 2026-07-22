import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 p-8">
        <Navbar />

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Settings page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
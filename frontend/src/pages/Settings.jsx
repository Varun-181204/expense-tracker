import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getProfile } from "../services/profileApi";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../services/settingsApi";
import { toast } from "react-toastify";

function Settings() {

  const navigate = useNavigate();

  const [showPasswordForm, setShowPasswordForm] = useState(false);

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

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const handleChangePassword = async () => {

    if (
        currentPassword === "" ||
        newPassword === "" ||
        confirmPassword === ""
    ) {

        toast.error("Please fill all fields");

        return;

    }

    if (newPassword !== confirmPassword) {

        toast.error("Passwords do not match");

        return;

    }

    try {

        const response = await changePassword({

            currentPassword,

            newPassword,

        });

        toast.success(response.message);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowPasswordForm(false);

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Password update failed"
        );

    }

};

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-8">

        <Navbar />

        <h1 className="text-3xl font-bold mb-8">
          Settings
        </h1>

        <div className="space-y-6">

          {/* Profile */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-4">
              👤 Profile
            </h2>

            <p className="text-gray-500">
              Name
            </p>

            <h3 className="text-lg font-semibold">
              {user.name}
            </h3>

            <p className="text-gray-500 mt-4">
              Email
            </p>

            <h3 className="text-lg font-semibold">
              {user.email}
            </h3>

          </div>

          {/* Security */}

<div className="bg-white rounded-2xl shadow-md p-6">

  <h2 className="text-xl font-bold mb-4">
    🔒 Security
  </h2>

  {!showPasswordForm ? (

    <button
      onClick={() => setShowPasswordForm(true)}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition"
    >
      Change Password
    </button>

  ) : (

    <div className="space-y-4">

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      />

      <div className="flex gap-3">

        <button
          onClick={handleChangePassword}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Update Password
        </button>

        <button
          onClick={() => {

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowPasswordForm(false);

          }}
          className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl"
        >
          Cancel
        </button>

      </div>

    </div>

  )}

</div>

          {/* Logout */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-4">
              🚪 Account
            </h2>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
            >
              Logout
            </button>

          </div>

          {/* About */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-4">
              ℹ️ About
            </h2>

            <p>Expense Tracker</p>

            <p className="text-gray-500">
              Version 1.0
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Settings;
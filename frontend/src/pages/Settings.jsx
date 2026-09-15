import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaSave, FaShieldAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../services/authService";
import { toast } from "react-toastify";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter both name and email");
      return;
    }

    try {
      setUpdatingProfile(true);
      const data = await updateProfile({ name, email });
      updateUser(data.user);
      toast.success("Profile information updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both current and new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <Layout
      title="Account Settings"
      subtitle="Manage your personal details, security credentials, and preferences"
    >
      <div className="max-w-4xl space-y-8">
        {/* User Identity Profile Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-600/30">
              {userInitial}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active Account</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Edit Profile Information */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                <FaUser />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Personal Info</h4>
                <p className="text-xs text-slate-500">Update your name and primary email</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <FaSave />
                  <span>{updatingProfile ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm">
                <FaShieldAlt />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Security</h4>
                <p className="text-xs text-slate-500">Change your login password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <FaSave />
                  <span>{changingPassword ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

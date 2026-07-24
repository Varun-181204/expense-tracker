import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {

    const response = await API.post("/auth/login", {
      email,
      password,
    });

    console.log(response.data);

    login(response.data.token);

    toast.success("Welcome Back!");

    navigate("/dashboard");

  } catch (error) {

    toast.error(
      error.response?.data?.message || "Login Failed"
    );

  } finally {

    setLoading(false);

  }
};
 return (
  <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 flex items-center justify-center px-4">

    <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

      <div className="text-center">

        <h1 className="text-4xl font-bold text-purple-700">
          💰 Expense Tracker
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Login to continue.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <div>

          <label className="block text-sm font-semibold mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

        </div>

<div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>

</div>

        <button
          type="submit"
            disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <div className="mt-8 text-center">

        <p className="text-gray-600">

          Don't have an account?

          <span
            onClick={() => navigate("/register")}
            className="ml-2 text-purple-600 font-semibold cursor-pointer hover:underline"
          >
            Create Account
          </span>

        </p>

      </div>

    </div>

  </div>
);
}

export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {

    const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
  e.preventDefault();

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

    alert(
      error.response?.data?.message || "Login Failed"
    );

  }
};

  return (
    <div
      style={{
        width: "350px",
        margin: "100px auto",
        padding: "20px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px gray",
      }}
    >
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            margin: "10px 0",
            padding: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            margin: "10px 0",
            padding: "10px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

        <Routes>

           {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

  {/* Public Routes */}

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  {/* Protected Routes */}

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/transactions"
    element={
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    }
  />

  <Route
    path="/categories"
    element={
      <ProtectedRoute>
        <Categories />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    }
  />

  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    }
  />

</Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

    </BrowserRouter>
  );
}

export default App;
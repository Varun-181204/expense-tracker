import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { NotificationProvider } from "./context/NotificationContext";

import AuthProvider from "./context/AuthContext";

import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

<AuthProvider>

<ThemeProvider>
  <NotificationProvider>
    <App />
  </NotificationProvider>
</ThemeProvider>

</AuthProvider>

);
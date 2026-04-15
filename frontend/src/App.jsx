import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

// Import all 3 views
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx"; // Create this or use AdminDashboard

function App() {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user_info"));
  const userRole = user?.role || "user";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Single Dynamic Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {userRole === "admin" && <AdminDashboard />}
            {userRole === "manager" && <ManagerDashboard />}
            {userRole === "user" && <UserDashboard />}
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

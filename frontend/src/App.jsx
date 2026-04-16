import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import Navbar from "./components/layout/Navbar.jsx";

function App() {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const userRole = user?.role || "user";
  const location = useLocation();

  // In pages par Navbar nahi dikhega
  const authPages = ["/login", "/register"];
  const showNavbar = !authPages.includes(location.pathname);

  return (
    <>
      {/* Agar auth page nahi hai, toh Navbar dikhao */}
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        {/* Profile Page (Optional: Agar alag se rakhna ho) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;

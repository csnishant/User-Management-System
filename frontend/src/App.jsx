import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import Navbar from "./components/layout/Navbar.jsx";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const userRole = user?.role || "user";
  const hideNavbarOn = ["/login", "/register"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7]">
      {showNavbar && <Navbar />}

      <main className={`flex-grow ${showNavbar ? "pt-4" : ""}`}>
        <Routes>
          {/* ✅ Agar user logged in hai, toh login/register page access nahi hoga */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {userRole === "admin" ? (
                  <AdminDashboard />
                ) : userRole === "manager" ? (
                  <ManagerDashboard />
                ) : (
                  <UserDashboard />
                )}
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

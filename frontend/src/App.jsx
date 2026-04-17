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

  // ✅ Navbar ko sirf Login aur Register par hide karein
  // Baaki sab jagah (Dashboards) par dikhega
  const hideNavbarOn = ["/login", "/register"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7]">
      {showNavbar && <Navbar />}

      {/* Main Content Area - isme hum padding-top add karte hain agar Navbar fixed ho */}
      <main className={`flex-grow ${showNavbar ? "pt-4" : ""}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

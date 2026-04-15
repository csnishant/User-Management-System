import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./auth/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
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

      {/* Fallback - Ye automatically handle karega logic */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;

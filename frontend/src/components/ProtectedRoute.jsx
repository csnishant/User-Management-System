import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Aapka AuthContext hook

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Agar Context abhi check kar raha hai (Refresh ke waqt), toh spinner dikhao


  // 2. Agar user logged in nahi hai, toh use /login par redirect karo
  if (!user) {
    // 'state={{ from: location }}' dene se login ke baad user wapas usi page par auto-redirect ho jayega
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Agar user mil gaya, toh Dashboard ya requested page dikhao
  return children;
};

export default ProtectedRoute;

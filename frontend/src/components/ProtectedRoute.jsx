// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Or spinner
  }

  return children;
};

export default ProtectedRoute;

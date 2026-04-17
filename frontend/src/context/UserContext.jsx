import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// 1. Context Create Kiya
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Common Axios Instance Generator
  const getAxiosInstance = (endpoint) => {
    return axios.create({
      baseURL: endpoint,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  // Fetch Users Function (Dono dashboard use kar payenge)
  const fetchUsers = async (endpoint, params) => {
    setLoading(true);
    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.get("/users", { params });

      if (res.data.success) {
        // Agar manager hai toh filter lagao (Ye hum dashboard me bhi handle kar sakte hain)
        setUsers(res.data.data);
        setTotalPages(res.data.pagination?.pages || 1);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ users, setUsers, loading, totalPages, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook use karne ke liye
export const useUserContext = () => useContext(UserContext);

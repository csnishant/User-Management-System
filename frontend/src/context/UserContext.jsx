import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const getAxiosInstance = (endpoint) => {
    return axios.create({
      baseURL: endpoint,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  // 1. Fetch Users
  const fetchUsers = async (endpoint, params) => {
    setLoading(true);
    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.get("/users", { params });
      if (res.data.success) {
        setUsers(res.data.data);
        setTotalPages(res.data.pagination?.pages || 1);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // 2. Create User Action
  const createUser = async (endpoint, userData) => {
    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.post("/users", userData);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // 3. Update User Action
  const updateUser = async (endpoint, id, userData) => {
    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.put(`/users/${id}`, userData);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // 4. Delete User Action
  const deleteUser = async (endpoint, id) => {
    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.delete(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        totalPages,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

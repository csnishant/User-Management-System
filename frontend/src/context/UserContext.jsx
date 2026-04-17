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
const fetchUsers = async (endpoint, params) => {
  // Sirf pehli baar load hote waqt ya page change par loading dikhayein
  if (users.length === 0 || params.page !== 1) {
    setLoading(true);
  }

  try {
    const api = getAxiosInstance(endpoint);
    const res = await api.get("/users", { params });
    if (res.data.success) {
      setUsers(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    }
  } catch (err) {
    toast.error("Failed to fetch");
  } finally {
    setLoading(false);
  }
};

  // 1. Create User (Optimistic)
  const createUser = async (endpoint, userData) => {
    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.post("/users", userData);
      if (res.data.success) {
        // Backend se fresh data aane par hi list mein update karein
        // kyunki ID backend se aati hai
        setUsers((prev) => [res.data.data, ...prev]);
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // 2. Update User (INSTANT - No 2 Sec Wait)
  const updateUser = async (endpoint, id, userData) => {
    // Backup purana data (Error handling ke liye)
    const previousUsers = [...users];

    // --- STEP 1: UI ko turant update karein ---
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === id ? { ...u, ...userData } : u)),
    );

    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.put(`/users/${id}`, userData);

      if (!res.data.success) {
        // Agar fail hua toh purana data wapas layein
        setUsers(previousUsers);
        toast.error("Update failed on server");
      }
      return res.data;
    } catch (err) {
      // --- STEP 2: Error aane par rollback ---
      setUsers(previousUsers);
      throw err;
    }
  };

  // 3. Delete User (INSTANT)
  const deleteUser = async (endpoint, id) => {
    const previousUsers = [...users];

    // --- STEP 1: Turant UI se hatao ---
    setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));

    try {
      const api = getAxiosInstance(endpoint);
      const res = await api.delete(`/users/${id}`);

      if (!res.data.success) {
        setUsers(previousUsers);
        toast.error("Delete failed on server");
      }
      return res.data;
    } catch (err) {
      // --- STEP 2: Error aane par rollback ---
      setUsers(previousUsers);
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash2,
  UserPlus,
  Search,
  X,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ADMIN_API_END_POINT } from "../utils/constant";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // States for Search and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ role: "", status: "" });

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const adminAxios = axios.create({
    baseURL: ADMIN_API_END_POINT,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetch users whenever page, search, or filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Backend now expects query params: ?page=...&search=...&role=...
      const res = await adminAxios.get("/users", {
        params: {
          page: currentPage,
          search: searchTerm,
          role: filters.role,
          status: filters.status,
          limit: 8, // Adjust as needed
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. CREATE USER (Handles auto-generated password alert)
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAxios.post("/users", newUser);
      if (res.data.success) {
        const msg = res.data.generatedPassword
          ? `User Created! Auto-generated Password: ${res.data.generatedPassword}`
          : "User Created Successfully!";
        alert(msg);
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  // 2. DELETE USER (Uses /users/:id)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      const res = await adminAxios.delete(`/users/${id}`);
      if (res.data.success) fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 3. UPDATE USER ROLE OR STATUS (Uses /users/:id)
  const handleUpdateUser = async (id, updatedData) => {
    try {
      const res = await adminAxios.put(`/users/${id}`, updatedData);
      if (res.data.success) {
        setUsers(
          users.map((u) => (u._id === id ? { ...u, ...updatedData } : u)),
        );
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Console</h1>
            <p className="text-gray-500 font-medium">
              Manage permissions and users
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg">
            <UserPlus size={20} /> Create New User
          </button>
        </div>
        {/* Filters & Search */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search Bar */}
          <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center border border-gray-100 flex-1 min-w-[300px]">
            <Search className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full outline-none font-medium"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Role Filter */}
          <select
            className="bg-white px-4 rounded-2xl border border-gray-100 font-bold text-gray-600 outline-none h-12"
            value={filters.role}
            onChange={(e) => {
              setFilters({ ...filters, role: e.target.value });
              setCurrentPage(1); // Reset to first page on filter change
            }}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>

          {/* Status Filter - ADDED THIS */}
          <select
            className="bg-white px-4 rounded-2xl border border-gray-100 font-bold text-gray-600 outline-none h-12"
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setCurrentPage(1); // Reset to first page on filter change
            }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Optional: Reset Button */}
          {(filters.role || filters.status || searchTerm) && (
            <button
              onClick={() => {
                setFilters({ role: "", status: "" });
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="text-indigo-600 font-bold px-4 hover:underline">
              Clear All
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">
                  User
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">
                  Role
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold uppercase">
                        {user.username[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleUpdateUser(user._id, { role: e.target.value })
                      }
                      className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-lg p-2 outline-none">
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() =>
                        handleUpdateUser(user._id, {
                          status:
                            user.status === "active" ? "inactive" : "active",
                        })
                      }
                      className={`flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full uppercase ${
                        user.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                      {user.status === "active" ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <ShieldAlert size={14} />
                      )}
                      {user.status}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="p-6 flex justify-between items-center bg-gray-50/50 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50">
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* MODAL - Add User */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X />
              </button>
              <h2 className="text-2xl font-black mb-6 text-gray-900">
                Add New User
              </h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password (Optional - will auto-gen if empty)"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none"
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }>
                  <option value="user">Role: User</option>
                  <option value="manager">Role: Manager</option>
                  <option value="admin">Role: Admin</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-lg mt-4">
                  Register User
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

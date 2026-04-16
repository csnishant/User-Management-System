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
  Edit2,
  Check,
} from "lucide-react";
import { ADMIN_API_END_POINT } from "../utils/constant";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // Kounsa row edit ho raha hai
  const [editForm, setEditForm] = useState({}); // Edit karte waqt ka temporary data

  // Pagination & Filters
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

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAxios.get("/users", {
        params: {
          page: currentPage,
          search: searchTerm,
          role: filters.role,
          status: filters.status,
          limit: 8,
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

  // --- ACTIONS ---

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAxios.post("/users", newUser);
      if (res.data.success) {
        alert(
          res.data.generatedPassword
            ? `User Created! Pass: ${res.data.generatedPassword}`
            : "User Created!",
        );
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  const startEditing = (user) => {
    setEditingId(user._id);
    setEditForm({ ...user }); // Current user data ko form mein bharna
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const res = await adminAxios.put(`/users/${id}`, editForm);
      if (res.data.success) {
        setEditingId(null);
        fetchUsers(); // Refresh data
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      const res = await adminAxios.delete(`/users/${id}`);
      if (res.data.success) fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Console</h1>
            <p className="text-gray-500 font-medium">
              Manage every detail of your users
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <UserPlus size={20} /> Add Member
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center border border-gray-100 flex-1 min-w-[300px]">
            <Search className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full outline-none font-medium text-gray-600"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="bg-white px-4 rounded-2xl border border-gray-100 font-bold text-gray-600 outline-none cursor-pointer h-12"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select
            className="bg-white px-4 rounded-2xl border border-gray-100 font-bold text-gray-600 outline-none cursor-pointer h-12"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-xs font-black text-gray-400 uppercase tracking-wider">
                <th className="px-8 py-5">Full Info</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    {editingId === user._id ? (
                      <div className="space-y-2">
                        <input
                          className="block w-full border border-indigo-200 rounded-lg px-2 py-1 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                        />
                        <input
                          className="block w-full border border-indigo-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-400 font-bold">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <select
                      disabled={editingId !== user._id}
                      value={editingId === user._id ? editForm.role : user.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className={`text-sm font-black rounded-lg p-1 outline-none ${editingId === user._id ? "bg-white border border-indigo-200" : "bg-transparent text-gray-500"}`}>
                      <option value="user">USER</option>
                      <option value="manager">MANAGER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    <select
                      disabled={editingId !== user._id}
                      value={
                        editingId === user._id ? editForm.status : user.status
                      }
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-none outline-none cursor-pointer ${
                        (editingId === user._id
                          ? editForm.status
                          : user.status) === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === user._id ? (
                        <button
                          onClick={() => handleUpdateSubmit(user._id)}
                          className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-100">
                          <Check size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(user)}
                          className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-xl transition-all">
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-6 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30">
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal as usual... (Code same as before) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X />
              </button>
              <h2 className="text-2xl font-black mb-6">Register Member</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password (Optional)"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none"
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }>
                  <option value="user">Role: User</option>
                  <option value="manager">Role: Manager</option>
                  <option value="admin">Role: Admin</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 mt-4">
                  Create Account
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

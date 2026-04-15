import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { AUTH_API_END_POINT } from "../utils/constant";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch all users (Admin only API)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${AUTH_API_END_POINT}/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete User Handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // API call for delete logic here
      alert("User deleted successfully (Mock)");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              System Users
            </h1>
            <p className="text-gray-500 font-medium">
              Manage accounts, roles, and permissions
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <UserPlus size={20} />
            <span>Add New User</span>
          </button>
        </div>

        {/* Stats & Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400">Total Users</p>
              <h3 className="text-2xl font-black text-gray-800">
                {users.length}
              </h3>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center px-6">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              className="w-full outline-none text-gray-700 bg-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter
              className="text-gray-400 ml-3 cursor-pointer hover:text-indigo-600 transition-colors"
              size={20}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length > 0 ? (
                  users
                    .filter((u) =>
                      u.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                    )
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                              {user.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {user.username}
                              </p>
                              <p className="text-xs text-gray-500 font-medium">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-600"
                                : user.role === "manager"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                            <CheckCircle size={16} /> Active
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-indigo-600 shadow-sm transition-all border border-transparent hover:border-gray-100">
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-600 shadow-sm transition-all border border-transparent hover:border-gray-100">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-10 text-center text-gray-400 font-medium">
                      {loading ? "Fetching records..." : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

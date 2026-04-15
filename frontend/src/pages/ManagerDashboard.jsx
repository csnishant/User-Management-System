import React, { useState, useEffect } from "react";
import {
  Users,
  Edit2,
  Shield,
  CheckCircle,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { AUTH_API_END_POINT } from "../utils/constant";

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Manager Console
            </h1>
            <p className="text-gray-500 font-medium">
              Monitoring and managing user activities
            </p>
          </div>
          <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100">
            Limited Manager Permissions
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center px-6 mb-8">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Search users to manage..."
            className="w-full outline-none text-gray-700 bg-transparent"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Status
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
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
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
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            {/* Manager can only Edit 'user' role, not Admin or other Managers */}
                            {user.role === "user" ? (
                              <button className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all font-bold text-xs">
                                <Edit2 size={14} /> Edit User
                              </button>
                            ) : (
                              <button className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-400 rounded-xl cursor-not-allowed font-bold text-xs">
                                <Shield size={14} /> View Only
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-10 text-center text-gray-400 font-medium">
                      {loading ? "Loading users..." : "No records accessible."}
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

export default ManagerDashboard;

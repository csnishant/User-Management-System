import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, UserPlus, Shield, Search, X, CheckCircle } from "lucide-react";
import { ADMIN_API_END_POINT } from "../utils/constant";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Create user modal ke liye

  // New User State
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  // Axios Instance with Token
  const adminAxios = axios.create({
    baseURL: ADMIN_API_END_POINT,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAxios.get("/all-users");
      if (res.data.success) setUsers(res.data.users || res.data.data);
    } catch (err) {
      console.error("Fetch Error");
    } finally {
      setLoading(false);
    }
  };

  // 1. CREATE USER
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAxios.post("/create-user", newUser);
      if (res.data.success) {
        alert("User Created Successfully!");
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });
        fetchUsers(); // List refresh karein
      }
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  // 2. DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      const res = await adminAxios.delete(`/delete-user/${id}`);
      if (res.data.success) setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 3. UPDATE ROLE
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await adminAxios.put(`/update-role/${id}`, { role: newRole });
      if (res.data.success) {
        setUsers(
          users.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
        );
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Console</h1>
            <p className="text-gray-500 font-medium">
              Manage permissions and users
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <UserPlus size={20} /> Create New User
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl mb-6 shadow-sm flex items-center border border-gray-100">
          <Search className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search by username or email..."
            className="w-full outline-none font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
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
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users
                .filter((u) =>
                  u.username.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
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
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* CREATE USER MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
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
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }>
                  <option value="user">Assign Role: User</option>
                  <option value="manager">Assign Role: Manager</option>
                  <option value="admin">Assign Role: Admin</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all pt-4 mt-4">
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

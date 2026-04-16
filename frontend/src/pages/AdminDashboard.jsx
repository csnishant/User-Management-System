import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { ADMIN_API_END_POINT } from "../utils/constant";
import UserFilters from "../components/admin/UserFilters.jsx";
import UserTable from "../components/admin/UserTable.jsx";
import UserModal from "../components/admin/UserModal.jsx";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

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
    setEditForm({ ...user });
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const res = await adminAxios.put(`/users/${id}`, editForm);
      if (res.data.success) {
        setEditingId(null);
        fetchUsers();
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
  const openViewModal = (user) => {
    setNewUser(user); // Selected user ka data form mein bharo
    setShowModal(true);
    // Hum UserModal ko props mein 'mode' bhejenge
  };

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* FIXED: Header with Trigger Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Console</h1>
            <p className="text-gray-500 font-medium text-sm">
              Manage user roles and audit logs
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)} // Yeh modal kholne ke liye zaroori hai
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <UserPlus size={20} /> Add Member
          </button>
        </div>

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          setCurrentPage={setCurrentPage}
        />

        {loading ? (
          <div className="flex justify-center p-20 text-indigo-600 font-bold">
            Loading users...
          </div>
        ) : (
          <UserTable
            users={users}
            editingId={editingId}
            editForm={editForm}
            setEditForm={setEditForm}
            startEditing={startEditing}
            handleUpdateSubmit={handleUpdateSubmit}
            handleDelete={handleDelete}
            setEditingId={setEditingId}
            openViewModal={openViewModal}

            // View modal ke liye function pass karna
          />
        )}

        {/* Modal calls here */}
        <UserModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setNewUser({ username: "", email: "", password: "", role: "user" }); // Reset data on close
          }}
          onSubmit={handleCreateUser}
          userData={newUser}
          setUserData={setNewUser}
          mode={newUser._id ? "view" : "create"} // Agar ID hai toh view, warna create
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ADMIN_API_END_POINT } from "../utils/constant";
import UserFilters from "../components/dashboard/UserFilters.jsx";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";
import Swal from "sweetalert2";
// 1. Context Hook Import karein
import { useUserContext } from "../context/UserContext";

const AdminDashboard = () => {
  // 2. Context se global states aur fetch function nikaalein
  const { users, loading, totalPages, fetchUsers } = useUserContext();

  // Local UI States (Sirf is component ke liye zaroori hain)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ role: "", status: "" });

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  // Admin Actions ke liye Axios Instance (Create/Update/Delete ke liye)
  const adminAxios = axios.create({
    baseURL: ADMIN_API_END_POINT,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // 3. Global Fetch call (Context wala function)
  useEffect(() => {
    const params = {
      page: currentPage,
      search: searchTerm,
      role: filters.role,
      status: filters.status,
      limit: 100,
    };
    fetchUsers(ADMIN_API_END_POINT, params);
  }, [currentPage, searchTerm, filters]);

  // --- ACTIONS ---

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { username, email, password, role } = newUser;

    // Validation
    if (!username || !email || !password || !role)
      return toast.error("All fields mandatory!");
    if (password.length < 6) return toast.error("Password too short!");

    try {
      const res = await adminAxios.post("/users", newUser);
      if (res.data.success) {
        toast.success("User created successfully!");
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });
        // Refresh list using context fetch
        fetchUsers(ADMIN_API_END_POINT, { page: currentPage });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  const startEditing = (user) => {
    setEditingId(user._id);
    setEditForm({ ...user });
  };

  const handleUpdateSubmit = async (id) => {
    const { username, email, role } = editForm;
    if (!username || !email || !role)
      return toast.error("Required fields empty");

    try {
      const res = await adminAxios.put(`/users/${id}`, editForm);
      if (res.data.success) {
        toast.success("User updated successfully!");
        setEditingId(null);
        fetchUsers(ADMIN_API_END_POINT, { page: currentPage });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await adminAxios.delete(`/users/${id}`);
        if (res.data.success) {
          toast.success("User deleted!");
          fetchUsers(ADMIN_API_END_POINT, { page: currentPage });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const openViewModal = (user) => {
    setNewUser(user);
    setShowModal(true);
  };
  console.log("Context Users:", users);
  console.log("Loading State:", loading);

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Console</h1>
            <p className="text-gray-500 font-medium text-sm">
              Manage user roles and audit logs
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
          />
        )}

        <UserModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setNewUser({ username: "", email: "", password: "", role: "user" });
          }}
          onSubmit={handleCreateUser}
          userData={newUser}
          setUserData={setNewUser}
          mode={newUser._id ? "view" : "create"}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { toast, Toaster } from "react-hot-toast"; // 1. Toast Import kiya
import { ADMIN_API_END_POINT } from "../utils/constant";
import UserFilters from "../components/dashboard/UserFilters.jsx";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";
import Swal from "sweetalert2";


const AdminDashboard = () => {
  // ... (aapki existing states)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
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
          limit:100,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      toast.error("Failed to fetch users"); // Error Toast
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
const handleCreateUser = async (e) => {
  e.preventDefault();

  // --- VALIDATION LOGIC ---
  const { username, email, password, role } = newUser;

  if (!username || !email || !password || !role) {
    return toast.error("All fields are mandatory!");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return toast.error("Please enter a valid email address");
  }

  if (password.length < 6) {
    return toast.error("Password must be at least 6 characters");
  }

  if (username.length < 3) {
    return toast.error("Username must be at least 3 characters");
  }

  try {
    const res = await adminAxios.post("/users", newUser);
    if (res.data.success) {
      toast.success("User created successfully!");
      setShowModal(false);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      fetchUsers();
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
  // --- VALIDATION LOGIC ---
  const { username, email, role } = editForm;

  if (!username || !email || !role) {
    return toast.error("Username, Email and Role cannot be empty");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return toast.error("Invalid email format");
  }

  try {
    const res = await adminAxios.put(`/users/${id}`, editForm);
    if (res.data.success) {
      toast.success("User updated successfully!");
      setEditingId(null);
      fetchUsers();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  }
};

const handleDelete = async (id) => {
  // Stylish Warning Modal
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this user!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5", // Indigo-600
    cancelButtonColor: "#ef4444", // Red-500
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    background: "#ffffff",
    borderRadius: "16px",
    customClass: {
      popup: "rounded-3xl",
      confirmButton: "rounded-xl px-6 py-2",
      cancelButton: "rounded-xl px-6 py-2",
    },
  });

  // Agar user 'Yes' click kare tabhi delete api call hogi
  if (result.isConfirmed) {
    try {
      const res = await adminAxios.delete(`/users/${id}`);
      if (res.data.success) {
        toast.success("User deleted successfully!");
        fetchUsers();
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

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen font-sans">
      {/* 2. Toaster Component - Ye notifications ko dikhayega */}
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

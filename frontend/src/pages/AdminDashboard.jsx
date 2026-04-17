import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ADMIN_API_END_POINT } from "../utils/constant";
import UserFilters from "../components/dashboard/UserFilters.jsx";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";
import Swal from "sweetalert2";
import { useUserContext } from "../context/UserContext";

const AdminDashboard = () => {
  // Context se actions nikaalein
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } =
    useUserContext();

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

  // Fetch logic
  useEffect(() => {
    const params = {
      page: currentPage,
      search: searchTerm,
      role: filters.role,
      status: filters.status,
    };
    fetchUsers(ADMIN_API_END_POINT, params);
  }, [currentPage, searchTerm, filters]);

  // Handle Create
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const data = await createUser(ADMIN_API_END_POINT, newUser);
      if (data.success) {
        toast.success("User created!");
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });
        fetchUsers(ADMIN_API_END_POINT, { page: currentPage });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  // Handle Update
  const handleUpdateSubmit = async (id) => {
    try {
      const data = await updateUser(ADMIN_API_END_POINT, id, editForm);
      if (data.success) {
        toast.success("User updated!");
        setEditingId(null);
        fetchUsers(ADMIN_API_END_POINT, { page: currentPage });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteUser(ADMIN_API_END_POINT, id);
        if (data.success) {
          toast.success("Deleted!");
          fetchUsers(ADMIN_API_END_POINT, { page: currentPage });
        }
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // UI helpers
  const startEditing = (user) => {
    setEditingId(user._id);
    setEditForm({ ...user });
  };
  const openViewModal = (user) => {
    setNewUser(user);
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Admin Console</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2">
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
          <div className="text-center p-20">Loading...</div>
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

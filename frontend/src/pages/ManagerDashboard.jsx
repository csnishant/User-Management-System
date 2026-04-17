import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { MANAGER_API_END_POINT } from "../utils/constant";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";

// Context Hooks
import { useUserContext } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { users, loading, fetchUsers, updateUser } = useUserContext();

  // Local UI States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  // Initial Fetch & Filters
  useEffect(() => {
    fetchUsers(MANAGER_API_END_POINT, {
      page: currentPage,
      status: statusFilter,
    });
  }, [currentPage, statusFilter]);

  // --- Fast Update Action ---
  const handleUpdateSubmit = async (id) => {
    // 1. Edit mode turant band karein
    setEditingId(null); 
    try {
      // 2. Background mein update hone dein (Context handle karega UI update)
      await updateUser(MANAGER_API_END_POINT, id, editForm);
      toast.success("User updated!");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 bg-[#F8F9FC] min-h-screen">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Managing team as:{" "}
            <span className="font-bold text-indigo-600">{user?.username}</span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-end mb-6">
          <div className="bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-sm font-bold outline-none p-1 cursor-pointer">
              <option value="">All Members</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* --- Optimized Table Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
          {/* 1. Loading hone par Table ko gayab nahi karenge, sirf opacity kam karenge */}
          <div
            className={`${loading ? "opacity-40 pointer-events-none" : "opacity-100"} transition-all duration-300`}>
            <UserTable
              users={users}
              editingId={editingId}
              editForm={editForm}
              setEditForm={setEditForm}
              startEditing={(u) => {
                if (u.role === "admin")
                  return toast.error("Cannot edit Admin!");
                setEditingId(u._id);
                setEditForm({ ...u });
              }}
              handleUpdateSubmit={handleUpdateSubmit}
              handleDelete={null}
              setEditingId={setEditingId}
              openViewModal={(u) => {
                setEditForm(u);
                setShowModal(true);
              }}
            />
          </div>

          {/* 2. Loading Spinner overlay (Table ke upar dikhega, table delete nahi hoga) */}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>

        <UserModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode="view"
          userData={editForm}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
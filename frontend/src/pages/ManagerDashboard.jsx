import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { MANAGER_API_END_POINT } from "../utils/constant";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";
// 1. Context Import
import { useUserContext } from "../context/UserContext";

const ManagerDashboard = () => {
  // 2. Context States
  const { users, loading, fetchUsers } = useUserContext();

  // Local UI States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Naya Status Filter state (Dashboard ke andar)
  const [statusFilter, setStatusFilter] = useState("");

  const managerAxios = axios.create({
    baseURL: MANAGER_API_END_POINT,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // 3. Fetch users whenever status or page changes
  useEffect(() => {
    const params = {
      page: currentPage,
      status: statusFilter, // Direct status filter use ho raha hai
    };
    fetchUsers(MANAGER_API_END_POINT, params);
  }, [currentPage, statusFilter]);

  // --- UPDATE LOGIC ---
  const handleUpdateSubmit = async (id) => {
    try {
      const res = await managerAxios.put(`/users/${id}`, editForm);
      if (res.data.success) {
        toast.success("User updated successfully!");
        setEditingId(null);
        fetchUsers(MANAGER_API_END_POINT, { status: statusFilter });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const startEditing = (user) => {
    if (user.role === "admin") {
      return toast.error("Managers cannot edit Admin details!");
    }
    setEditingId(user._id);
    setEditForm({ ...user });
  };

  const openViewModal = (user) => {
    setEditForm(user);
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Manager Dashboard
            </h1>
            <p className="text-gray-500">View and update team members status</p>
          </div>

          {/* 4. Custom Status Filter Dropdown */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-bold text-gray-600 ml-2">
              Filter Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border-none text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium outline-none">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 font-bold text-indigo-600 animate-pulse">
            Loading team data...
          </div>
        ) : (
          <UserTable
            users={users}
            editingId={editingId}
            editForm={editForm}
            setEditForm={setEditForm}
            startEditing={startEditing}
            handleUpdateSubmit={handleUpdateSubmit}
            handleDelete={null} // Manager delete nahi kar sakta
            setEditingId={setEditingId}
            openViewModal={openViewModal}
          />
        )}

        <UserModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode="view"
          userData={editForm}
          setUserData={setEditForm}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;

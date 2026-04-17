import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Filter, ShieldCheck, LayoutDashboard } from "lucide-react";
import { MANAGER_API_END_POINT } from "../utils/constant";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";

// Context Hooks
import { useUserContext } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { users, loading, fetchUsers, updateUser } = useUserContext();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchUsers(MANAGER_API_END_POINT, {
      page: currentPage,
      status: statusFilter,
    });
  }, [currentPage, statusFilter]);

  const handleUpdateSubmit = async (id) => {
    setEditingId(null);
    try {
      await updateUser(MANAGER_API_END_POINT, id, editForm);
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f0f2f5] font-sans selection:bg-indigo-100">
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- Background Premium Decor --- */}
      {/* Dynamic Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-blue-200/30 to-pink-200/30 blur-[100px] -z-10" />

      {/* Floating Glass Sticker/Shape */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] w-64 h-64 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 shadow-2xl -z-10 flex items-center justify-center">
        <div className="w-40 h-40 bg-indigo-500/10 rounded-full blur-xl" />
        <ShieldCheck size={120} className="text-indigo-600/10 absolute" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 py-10 z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <LayoutDashboard className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                Manager Dashboard
              </h1>
              <p className="text-gray-500 flex items-center gap-1">
                Welcome back,{" "}
                <span className="font-bold text-indigo-600 underline decoration-indigo-200 decoration-2 underline-offset-4">
                  {user?.username}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Filter Dropdown - Premium Glassmorphism */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <Filter size={18} className="text-indigo-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-sm font-bold text-gray-700 outline-none cursor-pointer">
              <option value="">All Members</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </motion.div>
        </header>

        {/* --- Main Table Container --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group">
          {/* Glass Table Frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

          <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl shadow-gray-200/50 overflow-hidden">
            {/* Loading Overlay */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users
                        size={20}
                        className="text-indigo-600 animate-pulse"
                      />
                    </div>
                  </div>
                  <p className="mt-4 font-bold text-indigo-900 tracking-widest text-xs uppercase">
                    Syncing Data...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`p-4 transition-all duration-500 ${loading ? "scale-[0.98] blur-sm" : "scale-100 blur-0"}`}>
              <UserTable
                users={users}
                editingId={editingId}
                editForm={editForm}
                setEditForm={setEditForm}
                startEditing={(u) => {
                  if (u.role === "admin")
                    return toast.error("Admin access restricted");
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
          </div>
        </motion.div>

        {/* Empty State / Footer Info */}
        {!loading && users.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium">
              No team members found for this criteria.
            </p>
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
  );
};

export default ManagerDashboard;

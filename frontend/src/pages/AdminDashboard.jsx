import React, { useState, useEffect } from "react";
import { UserPlus, Shield , Zap, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { ADMIN_API_END_POINT } from "../utils/constant";
import UserFilters from "../components/dashboard/UserFilters.jsx";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";
import Swal from "sweetalert2";
import { useUserContext } from "../context/UserContext";

const AdminDashboard = () => {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUserContext();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ role: "", status: "" });
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });

  useEffect(() => {
    fetchUsers(ADMIN_API_END_POINT, {
      page: currentPage,
      search: searchTerm,
      role: filters.role,
      status: filters.status,
    });
  }, [currentPage, searchTerm, filters]);

  // --- Handlers ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setShowModal(false);
    try {
      const data = await createUser(ADMIN_API_END_POINT, newUser);
      if (data.success) {
        toast.success("Member added to the system!");
        setNewUser({ username: "", email: "", password: "", role: "user" });
      }
    } catch (err) {
      toast.error("Process failed");
      setShowModal(true);
    }
  };

  const handleUpdateSubmit = async (id) => {
    setEditingId(null);
    try {
      await updateUser(ADMIN_API_END_POINT, id, editForm);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "This action is irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Delete",
      background: "rgba(255, 255, 255, 0.9)",
      backdrop: `rgba(0,0,123,0.1)`
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(ADMIN_API_END_POINT, id);
        toast.success("User removed");
      } catch (err) {
        toast.error("Action failed");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fcfdfe] overflow-hidden p-4 md:p-8">
      <Toaster position="top-right" />

      {/* --- PREMIUM BACKGROUND STICKERS & GRADIENTS --- */}
      {/* 1. Large Animated Gradient Orb */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-[120px] rounded-full -z-10 animate-pulse" />
      
      {/* 2. Floating "Sticker" Icons behind the table */}
      <motion.div 
        animate={{ y: [0, -40, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-10 opacity-[0.03] pointer-events-none -z-10"
      >
        <Shield size={300} strokeWidth={1} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 50, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 opacity-[0.04] pointer-events-none -z-10"
      >
        <Globe size={400} strokeWidth={1} />
      </motion.div>

      {/* 3. Mesh Gradient Background Layer */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] -z-20" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 transform rotate-3">
              <Zap className="text-white fill-current" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Console</h1>
              <p className="text-gray-400 font-medium">Control panel for member orchestration</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="group bg-indigo-600 hover:bg-black text-white px-8 py-4 rounded-[2rem] flex items-center gap-3 font-bold transition-all shadow-2xl shadow-indigo-100"
          >
            <UserPlus size={22} className="group-hover:rotate-12 transition-transform" /> 
            Add New Member
          </motion.button>
        </motion.header>

        {/* Filters Section */}
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           transition={{ delay: 0.2 }}
           className="mb-8"
        >
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            setCurrentPage={setCurrentPage}
          />
        </motion.div>

        {/* --- Main Content Section (Glassmorphism Table) --- */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative backdrop-blur-md bg-white/70 rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center p-32 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-[6px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-indigo-900 font-black tracking-widest uppercase text-xs">Syncing Database...</p>
            </div>
          ) : (
            <div className="p-2 transition-all duration-700">
               <UserTable
                users={users}
                editingId={editingId}
                editForm={editForm}
                setEditForm={setEditForm}
                startEditing={(u) => {
                   setEditingId(u._id);
                   setEditForm({ ...u });
                }}
                handleUpdateSubmit={handleUpdateSubmit}
                handleDelete={handleDelete}
                setEditingId={setEditingId}
                openViewModal={(u) => {
                  setNewUser(u);
                  setShowModal(true);
                }}
              />
            </div>
          )}
        </motion.div>
      </div>

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
  );
};

export default AdminDashboard;
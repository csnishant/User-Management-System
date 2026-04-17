import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  Shield,
  User as UserIcon,
} from "lucide-react";

const UserTable = ({
  users,
  editingId,
  editForm,
  setEditForm,
  startEditing,
  handleUpdateSubmit,
  handleDelete,
  openViewModal,
  setEditingId,
}) => {
  const isManagerDashboard = !handleDelete;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="relative">
      {/* Desktop Table - Ultra Clean Look */}
      <div className="hidden md:block overflow-x-auto rounded-[2rem]">
        <table className="w-full text-left border-separate border-spacing-y-2 px-4">
          <thead>
            <tr className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.1em]">
              <th className="px-6 py-4">User Identity</th>
              <th className="px-6 py-4">Designation</th>
              <th className="px-6 py-4">Account Status</th>
              <th className="px-6 py-4 text-right">Management</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {users.map((user) => (
              <motion.tr
                key={user._id}
                variants={itemVariants}
                className="group bg-white/60 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md border border-white">
                <td className="px-6 py-4 first:rounded-l-2xl border-y border-l border-transparent group-hover:border-indigo-100">
                  {editingId === user._id ? (
                    <EditInputs editForm={editForm} setEditForm={setEditForm} />
                  ) : (
                    <UserInfo user={user} />
                  )}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-indigo-100">
                  <RoleSelect
                    disabled={!handleDelete || editingId !== user._id}
                    value={editingId === user._id ? editForm.role : user.role}
                    onChange={(val) => setEditForm({ ...editForm, role: val })}
                    isEditing={editingId === user._id}
                  />
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-indigo-100">
                  <StatusSelect
                    isEditing={editingId === user._id}
                    value={
                      editingId === user._id ? editForm.status : user.status
                    }
                    onChange={(val) =>
                      setEditForm({ ...editForm, status: val })
                    }
                  />
                </td>
                <td className="px-6 py-4 text-right last:rounded-r-2xl border-y border-r border-transparent group-hover:border-indigo-100">
                  <ActionButtons
                    isEditing={editingId === user._id}
                    user={user}
                    isManagerDashboard={isManagerDashboard}
                    handleUpdateSubmit={handleUpdateSubmit}
                    setEditingId={setEditingId}
                    startEditing={startEditing}
                    handleDelete={handleDelete}
                    openViewModal={openViewModal}
                  />
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Mobile Premium Card List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="md:hidden space-y-4 px-4 pb-10">
        {users.map((user) => (
          <motion.div
            key={user._id}
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white shadow-lg shadow-indigo-100/20">
            <div className="flex justify-between items-start mb-4">
              {editingId === user._id ? (
                <EditInputs editForm={editForm} setEditForm={setEditForm} />
              ) : (
                <UserInfo user={user} />
              )}
              <StatusSelect
                isEditing={editingId === user._id}
                value={editingId === user._id ? editForm.status : user.status}
                onChange={(val) => setEditForm({ ...editForm, status: val })}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Role Type
                </span>
                <RoleSelect
                  disabled={!handleDelete || editingId !== user._id}
                  value={editingId === user._id ? editForm.role : user.role}
                  onChange={(val) => setEditForm({ ...editForm, role: val })}
                  isEditing={editingId === user._id}
                />
              </div>
              <ActionButtons
                isEditing={editingId === user._id}
                user={user}
                isManagerDashboard={isManagerDashboard}
                handleUpdateSubmit={handleUpdateSubmit}
                setEditingId={setEditingId}
                startEditing={startEditing}
                handleDelete={handleDelete}
                openViewModal={openViewModal}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Sub-components (Upgraded Visuals) ---

const UserInfo = ({ user }) => (
  <div className="flex items-center gap-4">
    <div className="relative group">
      <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">
        {user.username?.[0]?.toUpperCase()}
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
        {user.role === "admin" ? (
          <Shield size={10} className="text-orange-500" />
        ) : (
          <UserIcon size={10} className="text-indigo-500" />
        )}
      </div>
    </div>
    <div className="min-w-0">
      <h3 className="font-bold text-gray-900 truncate tracking-tight">
        {user.username}
      </h3>
      <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
    </div>
  </div>
);

const ActionButtons = ({
  isEditing,
  user,
  isManagerDashboard,
  handleUpdateSubmit,
  setEditingId,
  startEditing,
  handleDelete,
  openViewModal,
}) => {
  const isTargetAdmin = user.role === "admin";
  const btnClass =
    "p-2.5 rounded-2xl transition-all duration-200 active:scale-90 ";

  return (
    <div className="flex gap-2 justify-end">
      {isEditing ? (
        <>
          <button
            onClick={() => handleUpdateSubmit(user._id)}
            className={`${btnClass} bg-indigo-600 text-white shadow-md shadow-indigo-200`}>
            <Check size={18} />
          </button>
          <button
            onClick={() => setEditingId(null)}
            className={`${btnClass} bg-gray-100 text-gray-500 hover:bg-gray-200`}>
            <X size={18} />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => startEditing(user)}
            disabled={isManagerDashboard && isTargetAdmin}
            className={`${btnClass} ${isManagerDashboard && isTargetAdmin ? "opacity-20" : "text-indigo-500 bg-indigo-50 hover:bg-indigo-600 hover:text-white"}`}>
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => openViewModal(user)}
            className={`${btnClass} text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white`}>
            <Eye size={18} />
          </button>
          {handleDelete && (
            <button
              onClick={() => handleDelete(user._id)}
              className={`${btnClass} text-red-500 bg-red-50 hover:bg-red-600 hover:text-white`}>
              <Trash2 size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

const StatusSelect = ({ isEditing, value, onChange }) => (
  <select
    disabled={!isEditing}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-2 transition-all ${
      value === "active"
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : "bg-rose-50 text-rose-600 border-rose-100"
    } ${isEditing ? "cursor-pointer ring-2 ring-indigo-100" : "appearance-none"}`}>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
);

const RoleSelect = ({ disabled, value, onChange, isEditing }) => (
  <select
    disabled={disabled}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`text-xs font-black rounded-xl px-3 py-1.5 outline-none transition-all ${
      isEditing
        ? "bg-white border-2 border-indigo-100 ring-2 ring-indigo-50 shadow-sm"
        : "bg-transparent text-gray-500 appearance-none"
    }`}>
    <option value="user">USER</option>
    <option value="manager">MANAGER</option>
    <option value="admin">ADMIN</option>
  </select>
);

const EditInputs = ({ editForm, setEditForm }) => (
  <div className="space-y-2 max-w-[180px]">
    <input
      className="block w-full bg-white border-2 border-indigo-50 rounded-xl px-3 py-1.5 font-bold text-sm outline-none focus:border-indigo-500 transition-all"
      value={editForm.username}
      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
    />
    <input
      className="block w-full bg-white border-2 border-indigo-50 rounded-xl px-3 py-1.5 text-[10px] outline-none focus:border-indigo-500 transition-all"
      value={editForm.email}
      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
    />
  </div>
);

export default UserTable;

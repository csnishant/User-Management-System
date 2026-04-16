import React from "react";
import { Edit2, Trash2, Check, X, Eye } from "lucide-react";

const UserTable = ({
  users,
  editingId,
  editForm,
  setEditForm,
  startEditing,
  handleUpdateSubmit,
  handleDelete, // Admin pass karega, Manager null bhejega
  openViewModal,
  setEditingId,
}) => {
  // Check karein ki current dashboard Admin ka hai ya Manager ka
  const isManagerDashboard = !handleDelete;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr className="text-xs font-black text-gray-400 uppercase tracking-wider">
            <th className="px-8 py-5">Full Info</th>
            <th className="px-8 py-5">Role</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => {
            const isEditing = editingId === user._id;
            const isTargetAdmin = user.role === "admin";

            return (
              <tr
                key={user._id}
                className="hover:bg-gray-50/30 transition-colors">
                {/* 1. Full Info: Editable for all */}
                <td className="px-8 py-5">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        className="block w-full border border-indigo-200 rounded-lg px-2 py-1 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                      />
                      <input
                        className="block w-full border border-indigo-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 leading-tight">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400 font-bold">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}
                </td>
                {/* 2. Role Column: Manager cannot change this */}
             
                <td className="px-8 py-5">
                  <select
                    // ✅ Logic: Agar Manager Dashboard hai (handleDelete null hai), toh dropdown disabled rahega
                    disabled={!handleDelete || editingId !== user._id}
                    value={editingId === user._id ? editForm.role : user.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className={`text-sm font-black rounded-lg p-1 outline-none ${
                      editingId === user._id && handleDelete // Sirf admin ko border dikhe
                        ? "bg-white border border-indigo-200"
                        : "bg-transparent text-gray-500 appearance-none cursor-default"
                    }`}>
                    <option value="user">USER</option>
                    <option value="manager">MANAGER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </td>
                {/* 3. Status Column: Editable for all */}
                <td className="px-8 py-5">
                  <select
                    disabled={!isEditing}
                    value={isEditing ? editForm.status : user.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-none outline-none cursor-pointer ${
                      (isEditing ? editForm.status : user.status) === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    } ${!isEditing && "appearance-none cursor-default"}`}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                {/* 4. Actions Column */}
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdateSubmit(user._id)}
                          className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg">
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit Button: Manager cannot edit an Admin */}
                        <button
                          onClick={() => startEditing(user)}
                          disabled={isManagerDashboard && isTargetAdmin}
                          className={`p-2 rounded-xl transition-all ${
                            isManagerDashboard && isTargetAdmin
                              ? "text-gray-200 cursor-not-allowed"
                              : "text-indigo-400 hover:bg-indigo-50"
                          }`}>
                          <Edit2 size={18} />
                        </button>

                        {/* Delete Button: Only for Admin Dashboard */}
                        {handleDelete && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        )}

                        <button
                          onClick={() => openViewModal(user)}
                          className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl transition-all">
                          <Eye size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

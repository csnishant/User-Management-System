import React from "react";
import { Edit2, Trash2, Check, X, Eye } from "lucide-react";

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

  return (
    <div className="bg-white md:rounded-[2rem] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
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
            {users.map((user) => (
              <TableRow
                key={user._id}
                user={user}
                isEditing={editingId === user._id}
                editForm={editForm}
                setEditForm={setEditForm}
                startEditing={startEditing}
                handleUpdateSubmit={handleUpdateSubmit}
                handleDelete={handleDelete}
                openViewModal={openViewModal}
                setEditingId={setEditingId}
                isManagerDashboard={isManagerDashboard}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="md:hidden divide-y divide-gray-100">
        {users.map((user) => (
          <UserMobileCard
            key={user._id}
            user={user}
            isEditing={editingId === user._id}
            editForm={editForm}
            setEditForm={setEditForm}
            startEditing={startEditing}
            handleUpdateSubmit={handleUpdateSubmit}
            handleDelete={handleDelete}
            openViewModal={openViewModal}
            setEditingId={setEditingId}
            isManagerDashboard={isManagerDashboard}
          />
        ))}
      </div>
    </div>
  );
};

// --- Desktop Row Component ---
const TableRow = ({
  user,
  isEditing,
  editForm,
  setEditForm,
  startEditing,
  handleUpdateSubmit,
  handleDelete,
  openViewModal,
  setEditingId,
  isManagerDashboard,
}) => {
  const isTargetAdmin = user.role === "admin";

  return (
    <tr className="hover:bg-gray-50/30 transition-colors">
      <td className="px-8 py-5">
        {isEditing ? (
          <EditInputs editForm={editForm} setEditForm={setEditForm} />
        ) : (
          <UserInfo user={user} />
        )}
      </td>
      <td className="px-8 py-5">
        <RoleSelect
          disabled={!handleDelete || !isEditing}
          value={isEditing ? editForm.role : user.role}
          onChange={(val) => setEditForm({ ...editForm, role: val })}
          isEditing={isEditing}
          showBorder={isEditing && handleDelete}
        />
      </td>
      <td className="px-8 py-5">
        <StatusSelect
          isEditing={isEditing}
          value={isEditing ? editForm.status : user.status}
          onChange={(val) => setEditForm({ ...editForm, status: val })}
        />
      </td>
      <td className="px-8 py-5 text-right">
        <ActionButtons
          isEditing={isEditing}
          user={user}
          isManagerDashboard={isManagerDashboard}
          isTargetAdmin={isTargetAdmin}
          handleUpdateSubmit={handleUpdateSubmit}
          setEditingId={setEditingId}
          startEditing={startEditing}
          handleDelete={handleDelete}
          openViewModal={openViewModal}
        />
      </td>
    </tr>
  );
};

// --- Mobile Card Component ---
const UserMobileCard = ({
  user,
  isEditing,
  editForm,
  setEditForm,
  startEditing,
  handleUpdateSubmit,
  handleDelete,
  openViewModal,
  setEditingId,
  isManagerDashboard,
}) => {
  const isTargetAdmin = user.role === "admin";

  return (
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-start">
        {isEditing ? (
          <EditInputs editForm={editForm} setEditForm={setEditForm} />
        ) : (
          <UserInfo user={user} />
        )}
        <StatusSelect
          isEditing={isEditing}
          value={isEditing ? editForm.status : user.status}
          onChange={(val) => setEditForm({ ...editForm, status: val })}
        />
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase">
            Role
          </span>
          <RoleSelect
            disabled={!handleDelete || !isEditing}
            value={isEditing ? editForm.role : user.role}
            onChange={(val) => setEditForm({ ...editForm, role: val })}
            isEditing={isEditing}
            showBorder={isEditing && handleDelete}
          />
        </div>

        <div className="flex gap-2">
          <ActionButtons
            isEditing={isEditing}
            user={user}
            isManagerDashboard={isManagerDashboard}
            isTargetAdmin={isTargetAdmin}
            handleUpdateSubmit={handleUpdateSubmit}
            setEditingId={setEditingId}
            startEditing={startEditing}
            handleDelete={handleDelete}
            openViewModal={openViewModal}
          />
        </div>
      </div>
    </div>
  );
};

// --- Shared Helper Components (Dry Code) ---

const UserInfo = ({ user }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black shrink-0">
      {user.username?.[0]?.toUpperCase()}
    </div>
    <div className="min-w-0">
      <p className="font-black text-gray-900 leading-tight truncate">
        {user.username}
      </p>
      <p className="text-xs text-gray-400 font-bold truncate">{user.email}</p>
    </div>
  </div>
);

const EditInputs = ({ editForm, setEditForm }) => (
  <div className="space-y-2 w-full max-w-[200px]">
    <input
      className="block w-full border border-indigo-200 rounded-lg px-2 py-1 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      value={editForm.username}
      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
    />
    <input
      className="block w-full border border-indigo-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
      value={editForm.email}
      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
    />
  </div>
);

const RoleSelect = ({ disabled, value, onChange, isEditing, showBorder }) => (
  <select
    disabled={disabled}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`text-sm font-black rounded-lg p-1 outline-none ${
      showBorder
        ? "bg-white border border-indigo-200"
        : "bg-transparent text-gray-500 appearance-none"
    }`}>
    <option value="user">USER</option>
    <option value="manager">MANAGER</option>
    <option value="admin">ADMIN</option>
  </select>
);

const StatusSelect = ({ isEditing, value, onChange }) => (
  <select
    disabled={!isEditing}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-none outline-none ${
      value === "active"
        ? "bg-green-100 text-green-600"
        : "bg-red-100 text-red-600"
    } ${!isEditing && "appearance-none cursor-default"}`}>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
);

const ActionButtons = ({
  isEditing,
  user,
  isManagerDashboard,
  isTargetAdmin,
  handleUpdateSubmit,
  setEditingId,
  startEditing,
  handleDelete,
  openViewModal,
}) => (
  <div className="flex gap-2">
    {isEditing ? (
      <>
        <button
          onClick={() => handleUpdateSubmit(user._id)}
          className="p-2 bg-green-500 text-white rounded-xl shadow-lg">
          <Check size={18} />
        </button>
        <button
          onClick={() => setEditingId(null)}
          className="p-2 bg-gray-100 text-gray-400 rounded-xl">
          <X size={18} />
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => startEditing(user)}
          disabled={isManagerDashboard && isTargetAdmin}
          className={`p-2 rounded-xl ${isManagerDashboard && isTargetAdmin ? "text-gray-200" : "text-indigo-400 hover:bg-indigo-50"}`}>
          <Edit2 size={18} />
        </button>
        {handleDelete && (
          <button
            onClick={() => handleDelete(user._id)}
            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl">
            <Trash2 size={18} />
          </button>
        )}
        <button
          onClick={() => openViewModal(user)}
          className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl">
          <Eye size={18} />
        </button>
      </>
    )}
  </div>
);

export default UserTable;

import React from "react";
import { X } from "lucide-react";

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  userData,
  setUserData,
  mode = "create",
}) => {
  if (!isOpen) return null;

  // Input change handler logic
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-6 text-gray-900">
          {mode === "create" ? "Register Member" : "User Details"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username Input */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            disabled={mode === "view"}
            value={userData.username || ""}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 disabled:opacity-60"
          />

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            disabled={mode === "view"}
            value={userData.email || ""}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 disabled:opacity-60"
          />

          {/* Password - Only show in create mode */}
          {mode === "create" && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password || ""}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700"
            />
          )}

          {/* Role Select */}
          <select
            name="role"
            disabled={mode === "view"}
            value={userData.role || "user"}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none text-gray-700 disabled:opacity-60">
            <option value="user">Role: User</option>
            <option value="manager">Role: Manager</option>
            <option value="admin">Role: Admin</option>
          </select>

          {/* Audit Section - Only visible in View mode */}
          {mode === "view" && (
            <div className="mt-6 p-5 bg-indigo-50 rounded-[1.5rem] border border-indigo-100">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                Audit & Activity
              </h3>
              <div className="space-y-3 text-xs">
                {/* Created At */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">Created At</span>
                  <span className="font-black text-indigo-900">
                    {userData.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {/* Created By Section */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">Created By</span>
                  <span className="font-black text-indigo-900">
                    {/* 1. Check if it's an object with username (Populated) */}
                    {userData.createdBy?.username ||
                      /* 2. Check if it's just a string (ID or name) */
                      (typeof userData.createdBy === "string"
                        ? userData.createdBy
                        : "System Admin")}
                  </span>
                </div>

                {/* Updated By Section */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">Updated By</span>
                  <span className="font-black text-indigo-900">
                    {userData.updatedBy?.username ||
                      (typeof userData.updatedBy === "string"
                        ? userData.updatedBy
                        : "N/A")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button - Only in create mode */}
          {mode === "create" && (
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-4">
              Create Account
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserModal;

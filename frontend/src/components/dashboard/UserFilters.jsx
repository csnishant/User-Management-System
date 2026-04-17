import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  setCurrentPage,
}) => {
  // Local state for instant input feedback
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // --- DEBOUNCE LOGIC ---
  // Jab user typing band karega tabhi API call/Main state update hogi (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
      setCurrentPage(1);
    }, 500); // 500ms wait karega typing rukne ka

    return () => clearTimeout(timer);
  }, [localSearch, setSearchTerm, setCurrentPage]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-wrap items-center gap-4 mb-8">
      {/* Search Bar - Premium Glassmorphism */}
      <div className="relative flex-1 min-w-[320px] group">
        <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl group-hover:bg-indigo-500/10 transition-all duration-500" />
        <div className="relative bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm flex items-center border border-white hover:border-indigo-200 transition-all duration-300">
          <div className="bg-indigo-50 p-2.5 rounded-xl mr-3">
            <Search className="text-indigo-600" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-400"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="px-3 text-xs font-black text-indigo-400 hover:text-indigo-600">
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Role Filter */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300" />
        <div className="relative flex items-center bg-white h-14 px-4 rounded-2xl border border-gray-100 shadow-sm gap-3">
          <Filter size={16} className="text-gray-400" />
          <select
            className="bg-transparent font-black text-gray-600 outline-none cursor-pointer text-sm uppercase tracking-wider"
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}>
            <option value="">Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Status Filter */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300" />
        <div className="relative flex items-center bg-white h-14 px-4 rounded-2xl border border-gray-100 shadow-sm gap-3">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <select
            className="bg-transparent font-black text-gray-600 outline-none cursor-pointer text-sm uppercase tracking-wider"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default UserFilters;

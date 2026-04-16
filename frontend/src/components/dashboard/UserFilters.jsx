import { Search } from "lucide-react";

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  setCurrentPage,
}) => (
  <div className="flex flex-wrap gap-4 mb-6">
    <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center border border-gray-100 flex-1 min-w-[300px]">
      <Search className="text-gray-400 mr-3" />
      <input
        type="text"
        placeholder="Search users..."
        className="w-full outline-none font-medium text-gray-600"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
    <select
      className="bg-white px-4 rounded-2xl border border-gray-100 font-bold text-gray-600 outline-none h-12"
      value={filters.role}
      onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
      <option value="">All Roles</option>
      <option value="admin">Admin</option>
      <option value="manager">Manager</option>
      <option value="user">User</option>
    </select>
    <select
      className="bg-white px-4 rounded-2xl border border-gray-100 font-bold text-gray-600 outline-none h-12"
      value={filters.status}
      onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
);

export default UserFilters;

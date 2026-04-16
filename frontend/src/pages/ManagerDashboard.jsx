import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { MANAGER_API_END_POINT } from "../utils/constant";
import UserFilters from "../components/dashboard/UserFilters.jsx";
import UserTable from "../components/dashboard/UserTable.jsx";
import UserModal from "../components/dashboard/UserModal.jsx";

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ role: "", status: "" });

  const managerAxios = axios.create({
    baseURL: MANAGER_API_END_POINT,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filters]);

const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await managerAxios.get("/users", {
      params: {
        page: currentPage,
        search: searchTerm,
        role: filters.role,
        status: filters.status,
      },
    });

    if (res.data.success) {
      // ✅ FILTER LOGIC: Sirf wo users dikhao jo admin nahi hain
      const nonAdminUsers = res.data.data.filter(
        (user) => user.role !== "admin",
      );
      setUsers(nonAdminUsers);
      setTotalPages(res.data.pagination.pages);
    }
  } catch (err) {
    toast.error("Access Denied or Fetch Failed");
  } finally {
    setLoading(false);
  }
};

  // --- UPDATE LOGIC (Manager Only) ---
const handleUpdateSubmit = async (id) => {
  try {
    // 🚨 Pehle yahan `/user/${id}` tha, ise `/users/${id}` karein
    const res = await managerAxios.put(`/users/${id}`, editForm);

    if (res.data.success) {
      toast.success("User updated successfully!");
      setEditingId(null); // Edit mode off karein
      fetchUsers(); // List refresh karein
    }
  } catch (err) {
    console.error("Update Error:", err.response);
    toast.error(err.response?.data?.message || "Update failed");
  }
};

  const startEditing = (user) => {
    // Restriction: Manager Admin ko edit nahi kar sakta
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
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-gray-500">View and update team members status</p>
        </div>

        {/* Reuse: UserFilters */}
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          setCurrentPage={setCurrentPage}
        />

        {loading ? (
          <div className="flex justify-center p-20 font-bold text-indigo-600">
            Loading...
          </div>
        ) : (
          /* Reuse: UserTable */
          <UserTable
            users={users}
            editingId={editingId}
            editForm={editForm}
            setEditForm={setEditForm}
            startEditing={startEditing}
            handleUpdateSubmit={handleUpdateSubmit}
            handleDelete={null} // Manager delete nahi kar sakta, isliye null pass kiya
            setEditingId={setEditingId}
            openViewModal={openViewModal}
          />
        )}

        {/* Reuse: UserModal */}
        <UserModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode="view" // Manager ko sirf view/audit dikhane ke liye
          userData={editForm}
          setUserData={setEditForm}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;

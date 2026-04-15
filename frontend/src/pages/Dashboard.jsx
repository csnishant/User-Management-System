import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Briefcase,
  Trash2,
  Plus,
  RefreshCw,
  X,
  Edit2,
  Search,
  Menu,
} from "lucide-react";
import { LEADS_API_END_POINT } from "../utils/constant";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "New",
  });

  const API_URL = "http://localhost:5000/api/leads";

  const token = localStorage.getItem("token");

  // --- FETCH DATA ---
  // --- FETCH DATA ---
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(LEADS_API_END_POINT, {
        // Yahan replace hua
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // --- ADD or UPDATE Lead ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? "Updating..." : "Adding...");
    try {
      if (editingId) {
        // UPDATE Logic
        const res = await axios.put(
          `${LEADS_API_END_POINT}/${editingId}`,
          formData,
          {
            // Yahan replace hua
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setLeads(leads.map((l) => (l._id === editingId ? res.data.data : l)));
        toast.success("Lead Updated!", { id: loadingToast });
      } else {
        // CREATE Logic
        const res = await axios.post(LEADS_API_END_POINT, formData, {
          // Yahan replace hua
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads([...leads, res.data.data]);
        toast.success("Lead Added!", { id: loadingToast });
      }
      closeModal();
    } catch (err) {
      toast.error("Operation failed", { id: loadingToast });
    }
  };

  // --- DELETE Lead ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${LEADS_API_END_POINT}/${id}`, {
        // Yahan replace hua
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter((l) => l._id !== id));
      toast.success("Lead Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openModal = (lead = null) => {
    if (lead) {
      setEditingId(lead._id);
      setFormData({ name: lead.name, email: lead.email, status: lead.status });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", status: "New" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col md:flex-row font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- SIDEBAR (Responsive) --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col p-6`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <LayoutDashboard />
            </div>
            <span className="font-bold text-lg">Avyukt Core</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X />
          </button>
        </div>
        <nav className="space-y-2 flex-1">
          <div className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
            <Users className="w-5 h-5" /> Leads
          </div>
          <div className="flex items-center gap-3 p-3 text-gray-400 hover:bg-gray-50 rounded-xl cursor-not-allowed">
            <Briefcase className="w-5 h-5" /> Tasks
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl font-bold mt-auto">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-4 md:p-10">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white rounded-lg shadow-sm">
            <Menu />
          </button>
          <span className="font-black text-indigo-600">ACT</span>
          <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
        </div>

        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Hi, {username}! 👋
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Manage your leads and tasks effortlessly.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchLeads}
              className="p-3 bg-white border rounded-2xl hover:bg-gray-50">
              <RefreshCw className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
              <Plus /> Add Lead
            </button>
          </div>
        </header>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-800 text-lg">Lead Management</h2>
            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {leads.length} Total
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] uppercase font-bold text-gray-400">
                  <th className="px-6 py-4">Client Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{lead.name}</div>
                      <div className="text-xs text-gray-400">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-green-50 text-green-600 uppercase">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openModal(lead)}
                        className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && leads.length === 0 && (
              <div className="p-20 text-center text-gray-400">
                No data available. Add your first lead!
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- CRUD MODAL (ADD / EDIT) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {editingId ? "Edit Lead" : "New Lead"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full">
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  required
                  className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  required
                  className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                {editingId ? "Update Lead Info" : "Save Lead"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

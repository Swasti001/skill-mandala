import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { UserPlus, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, X, CheckCircle, AlertOctagon } from "lucide-react";
import axios from "axios";

const statusStyles = {
  ACTIVE: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  "ON BREAK": "bg-violet-500/15 text-violet-300 border-violet-500/20",
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "USER", credits: 100, status: "ACTIVE" });
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/users", { headers });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role || "USER", credits: user.credits || 100, status: user.status || "ACTIVE" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${selectedUser.id}`, formData, { headers });
      showToast("User updated successfully!");
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast("Update failed.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, { headers });
      showToast("User deleted.");
      fetchUsers();
    } catch (err) {
      showToast("Failed to delete user.", "error");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#06142b] flex items-center justify-center text-violet-300">Loading Population...</div>;

  return (
    <div className="min-h-screen bg-[#06142b] text-slate-50 relative">
      <AdminNavbar />

      <main className="ml-[200px] min-h-screen px-8 pb-10 pt-24">
        <div className="max-w-[1200px] mx-auto space-y-8">
          
          {/* Header */}
          <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-white mb-2">Network Weavers</h1>
              <p className="text-[14px] text-slate-400">View and manage the identities within the Mandala ecosystem.</p>
            </div>
          </section>

          {/* Stats Summary */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { label: "Total Population", val: users.length, sub: "Verified users", color: "text-white" },
               { label: "Active Nodes", val: users.filter(u => u.status === 'ACTIVE').length || users.length, sub: "Currently engaging", color: "text-emerald-400" },
               { label: "Global Credits", val: users.reduce((acc, u) => acc + (u.credits || 0), 0), sub: "Total liquidity", color: "text-amber-400" }
             ].map((s, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                   <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">{s.label}</p>
                   <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.val}</p>
                   <p className="text-[12px] text-slate-600">{s.sub}</p>
                </div>
             ))}
          </section>

          {/* Users Table */}
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0c192e]/60 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/20 text-[11px] uppercase tracking-widest text-slate-500 font-black">
                    <th className="px-6 py-4">Identity</th>
                    <th className="px-6 py-4">Access Level</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Credits</th>
                    <th className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-700">
                            {user.name ? user.name.charAt(0) : "U"}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-white mb-0.5">{user.name}</p>
                            <p className="text-[12px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter">{user.role || "USER"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold border ${statusStyles[user.status] || statusStyles['ACTIVE']}`}>
                          <span className="h-1 w-1 rounded-full bg-current" />
                          {user.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-medium text-slate-300">{user.credits || 0} φ</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition">
                            <Pencil size={15} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#060b13]/80 backdrop-blur-md">
           <div className="bg-[#121b2d] border border-slate-700/60 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition">
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-1">Edit Identity</h2>
              <p className="text-[13px] text-slate-500 mb-8">Modify the access levels or liquidity for this network node.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition" />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Role</label>
                        <select 
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition">
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Status</label>
                        <select 
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition">
                            <option value="ACTIVE">Active</option>
                            <option value="ON BREAK">On Break</option>
                            <option value="PENDING">Pending</option>
                            <option value="BANNED">Banned</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Credits</label>
                        <input 
                          type="number" 
                          value={formData.credits}
                          onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition" />
                    </div>
                 </div>
                 <button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-900/30 hover:opacity-90 transition active:scale-[0.98]">
                    Save Synchronized Changes
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertOctagon size={20} />}
          <span className="text-[13px] font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
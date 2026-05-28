import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { 
  Filter, 
  AlertCircle, 
  AlertOctagon, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Ban, 
  AlertTriangle, 
  X, 
  Lock, 
  CheckCircle, 
  Search, 
  User, 
  FileText, 
  Calendar,
  ShieldAlert,
  Send,
  RefreshCw,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import adminApi from "../adminApi";

const AdminReports = () => {
  const [reportsData, setReportsData] = useState([]);
  const [metrics, setMetrics] = useState({ pendingHighPriority: 0, totalReports24H: 0, moderatedToday: 0, avgResponseTime: "14m" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, UNDER_REVIEW, RESOLVED, REJECTED
  const [severeOnly, setSevereOnly] = useState(false);

  // Selected report for detailed viewing and editing
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Admin edits state
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editNotes, setEditNotes] = useState("");
  const [editResponse, setEditResponse] = useState("");
  const [editReportedEvidence, setEditReportedEvidence] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await adminApi.get("/admin/reports");
      setReportsData(res.data.reportsList || []);
      setMetrics(res.data.metrics || { pendingHighPriority: 0, totalReports24H: 0, moderatedToday: 0, avgResponseTime: "14m" });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reports queue. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update selection detail fields when selected report changes
  useEffect(() => {
    if (selectedReport) {
      setEditStatus(selectedReport.status || "PENDING");
      setEditNotes(selectedReport.adminNotes || "");
      setEditResponse(selectedReport.reportedResponse || "");
      setEditReportedEvidence(selectedReport.reportedEvidence || "");
    }
  }, [selectedReport]);

  const handleReportAction = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [`${id}-${action}`]: true }));
    try {
      const res = await adminApi.put(`/admin/reports/${id}/${action}`);
      showToast(res.data.message, "success");
      
      // Update selected report if it's the one currently open
      if (selectedReport && selectedReport.id === id) {
        let updatedStatus = "RESOLVED";
        let updatedAction = "NONE";
        if (action === "reject") {
          updatedStatus = "REJECTED";
          updatedAction = "DISMISSED";
        } else if (action === "warn") {
          updatedAction = "WARNING";
        } else if (action === "suspend") {
          updatedAction = "SUSPENSION";
        } else if (action === "ban") {
          updatedAction = "BAN";
        }

        setSelectedReport(prev => ({
          ...prev,
          status: updatedStatus,
          actionTaken: updatedAction
        }));
      }

      await fetchData(true);
    } catch (err) {
      console.error(err);
      showToast("Moderation action failed. Please try again.", "error");
    }
    setActionLoading(prev => ({ ...prev, [`${id}-${action}`]: false }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    
    const id = selectedReport.id;
    setActionLoading(prev => ({ ...prev, [`${id}-update`]: true }));
    
    try {
      const payload = {
        status: editStatus,
        adminNotes: editNotes,
        reportedResponse: editResponse,
        reportedEvidence: editReportedEvidence
      };

      const res = await adminApi.put(`/admin/reports/${id}/update`, payload);
      showToast("Case decision and notes saved successfully.", "success");
      
      // Update locally
      setSelectedReport(prev => ({
        ...prev,
        status: editStatus,
        adminNotes: editNotes,
        reportedResponse: editResponse,
        reportedEvidence: editReportedEvidence
      }));

      await fetchData(true);
    } catch (err) {
      console.error(err);
      showToast("Failed to save changes.", "error");
    } finally {
      setActionLoading(prev => ({ ...prev, [`${id}-update`]: false }));
    }
  };

  // Filter reports
  const filteredReports = reportsData.filter(report => {
    // Status Filter
    if (statusFilter !== "ALL" && report.status !== statusFilter) {
      return false;
    }
    // Severe/High Priority Only
    if (severeOnly && report.priority !== "HIGH PRIORITY") {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const categoryMatch = report.category?.toLowerCase().includes(query);
      const titleMatch = report.title?.toLowerCase().includes(query);
      const reporterMatch = report.reporter?.name?.toLowerCase().includes(query);
      const reportedMatch = report.reported?.name?.toLowerCase().includes(query);
      return categoryMatch || titleMatch || reporterMatch || reportedMatch;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#06142b] text-slate-100 font-sans flex overflow-hidden">
      <AdminNavbar />

      <main className="flex-1 min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-10 ml-[200px] overflow-y-auto transition-all duration-300">
        <div className="max-w-[1300px] mx-auto space-y-6">
          
          {/* Header */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert size={20} className="text-violet-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Security Control</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5 leading-none">
                Safety & Moderation Control Room
              </h1>
              <p className="text-[12px] sm:text-xs text-slate-400">
                Fairly review reports, examine statements and evidence from both weavers, and enforce community standards.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button 
                onClick={() => fetchData()} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Queue
              </button>
            </div>
          </section>

          {/* Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                     <AlertOctagon size={18} />
                  </div>
                  <span className="text-[9px] font-black uppercase bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">Critical</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-1 leading-none">{metrics.pendingHighPriority}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Pending High Priority</p>
             </div>

             <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
                     <AlertCircle size={18} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">Overall</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-1 leading-none">{metrics.totalReports24H}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Cases Active</p>
             </div>

             <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                     <ShieldCheck size={18} />
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">Resolved</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-1 leading-none">{metrics.moderatedToday}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Cases Resolved</p>
             </div>

             <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                     <Clock size={18} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">SLA</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-1 leading-none">{metrics.avgResponseTime}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Avg. Response Time</p>
             </div>
          </section>

          {/* Main Grid: Left is list, Right is selected details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Section: Reports Queue List */}
            <section className="lg:col-span-7 bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-[24px] p-6 shadow-xl space-y-6">
              
              {/* Filters Panel */}
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-400 focus-within:border-violet-500/40 transition">
                  <Search size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by category, title, reporter or reported weaver..."
                    className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter Tabs & Severe Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
                    {[
                      { key: "ALL", label: "All Cases" },
                      { key: "PENDING", label: "Pending" },
                      { key: "UNDER_REVIEW", label: "Under Review" },
                      { key: "RESOLVED", label: "Resolved" },
                      { key: "REJECTED", label: "Rejected" }
                    ].map((tab) => (
                      <button 
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition ${statusFilter === tab.key ? "bg-violet-500 text-white shadow-md shadow-violet-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setSevereOnly(!severeOnly)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-black tracking-wider uppercase transition ${severeOnly ? "bg-red-500/20 text-red-400 border-red-500/40" : "bg-slate-950/60 text-slate-400 border-slate-800"}`}
                  >
                    <AlertOctagon size={12} /> Severe Only
                  </button>
                </div>
              </div>

              {/* Reports List */}
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                  <RefreshCw size={24} className="animate-spin mb-3 text-violet-400" />
                  <p className="text-xs uppercase font-black tracking-widest opacity-65">Synchronizing queue...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center text-red-400 text-sm">{error}</div>
              ) : filteredReports.length === 0 ? (
                <div className="py-16 text-center bg-slate-950/30 rounded-2xl border border-dashed border-slate-800">
                  <ShieldCheck size={36} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-[13px] font-bold text-slate-400">Clear queue! No matching reports found.</p>
                  <p className="text-[10px] text-slate-500 mt-1">Excellent job maintaining community standards.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredReports.map((report) => {
                    const isSelected = selectedReport && selectedReport.id === report.id;
                    const isPending = report.status === "PENDING";
                    const isUnderReview = report.status === "UNDER_REVIEW";

                    return (
                      <div 
                        key={report.id} 
                        onClick={() => setSelectedReport(report)}
                        className={`bg-[#0d1527] border rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${isSelected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-800/80 hover:border-slate-700/80'} ${isPending ? 'shadow-lg shadow-amber-500/5' : ''}`}
                      >
                         {/* Left indicator bar */}
                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${report.status === 'PENDING' ? 'bg-amber-400' : report.status === 'UNDER_REVIEW' ? 'bg-violet-400' : report.status === 'REJECTED' ? 'bg-slate-500' : 'bg-emerald-400'}`} />

                         {/* Case Header Details */}
                         <div className="flex items-start justify-between gap-3 pl-2">
                           <div className="space-y-1">
                             <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${report.priority === 'HIGH PRIORITY' ? 'bg-red-500/10 text-red-400 border-red-500/20' : report.priority === 'MEDIUM PRIORITY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700/60'}`}>{report.priority}</span>
                                <span className="text-[9px] font-black tracking-widest uppercase text-slate-400">{report.category}</span>
                             </div>
                             <h3 className="text-[14px] font-black text-white group-hover:text-violet-200 transition">{report.title}</h3>
                             <p className="text-xs text-slate-400 line-clamp-1">{report.desc}</p>
                           </div>
                           
                           {/* Status Badge */}
                           <span className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border ${report.status === 'PENDING' ? 'bg-amber-400/15 text-amber-400 border-amber-400/30' : report.status === 'UNDER_REVIEW' ? 'bg-violet-400/15 text-violet-400 border-violet-400/30' : report.status === 'REJECTED' ? 'bg-slate-800 text-slate-400 border-slate-700/60' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'}`}>
                             {report.status?.replace("_", " ")}
                           </span>
                         </div>

                         {/* Disputants involved */}
                         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pl-2 pt-3 border-t border-slate-800/40 text-xs">
                           
                           {/* Reporter */}
                           <div className="flex items-center gap-2 min-w-[120px]">
                             <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[9px] font-bold text-indigo-300 border border-indigo-500/20">R</div>
                             <div className="truncate">
                               <p className="text-[10px] font-bold text-slate-300">Reporter</p>
                               <p className="text-[11px] font-black text-white truncate">{report.reporter?.name || "System"}</p>
                             </div>
                           </div>

                           {/* VS divider */}
                           <span className="text-[9px] font-black text-slate-600 self-center uppercase tracking-widest">VS</span>

                           {/* Reported */}
                           <div className="flex items-center gap-2 min-w-[120px]">
                             <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[9px] font-bold text-rose-300 border border-rose-500/20">O</div>
                             <div className="truncate">
                               <p className="text-[10px] font-bold text-slate-300">Reported User</p>
                               <p className="text-[11px] font-black text-white truncate">{report.reported?.name || "Unknown"}</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-1.5 self-end sm:self-center ml-auto">
                              <span className="text-[10px] text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                              <ChevronRightIcon className="text-slate-500 group-hover:text-white transition" />
                           </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Right Section: Case Details and Actions Panel */}
            <section className="lg:col-span-5 space-y-6">
              
              {selectedReport ? (
                <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-[24px] p-6 shadow-xl space-y-6 animate-[fadeIn_0.2s_ease-out]">
                  
                  {/* Panel Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Case #<span className="text-violet-400">{selectedReport.id}</span>
                      </h2>
                      <span className="text-[10px] text-slate-400">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedReport(null)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Related Entity details */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Related Platform Entity</p>
                      <p className="text-xs font-bold text-white">{selectedReport.relatedEntity || "User Profile"}</p>
                    </div>
                  </div>

                  {/* Statements and evidence columns */}
                  <div className="space-y-4">
                    
                    {/* Reporter statement */}
                    <div className="bg-indigo-950/15 border border-indigo-900/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">R</div>
                          <div>
                            <p className="text-[11px] font-black text-indigo-300">{selectedReport.reporter?.name || "System"}</p>
                            <p className="text-[9px] text-indigo-400 font-medium">{selectedReport.reporter?.email || "N/A"}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black tracking-widest uppercase text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">Reporter</span>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Statement</h4>
                        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-900">{selectedReport.desc}</p>
                      </div>
                      {selectedReport.reporterEvidence && (
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            Evidence Logs
                          </h4>
                          <div className="text-xs text-indigo-200 bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/30 leading-relaxed font-mono whitespace-pre-wrap">
                            {selectedReport.reporterEvidence}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reported statement/response */}
                    <div className="bg-rose-950/10 border border-rose-900/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px] font-bold text-rose-400">O</div>
                          <div>
                            <p className="text-[11px] font-black text-rose-300">{selectedReport.reported?.name || "Unknown Weaver"}</p>
                            <p className="text-[9px] text-rose-400 font-medium">
                              {selectedReport.reported?.email || "N/A"} • Status: <span className="font-black">{selectedReport.reported?.status || "ACTIVE"}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black tracking-widest uppercase text-rose-400 bg-rose-950 px-2 py-0.5 rounded">Reported</span>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Explanation / Response</h4>
                        {selectedReport.reportedResponse ? (
                          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-900">{selectedReport.reportedResponse}</p>
                        ) : (
                          <div className="p-3 bg-slate-950/30 border border-slate-800 rounded-lg text-slate-500 italic text-xs">
                            No explanation or response submitted yet by the reported user.
                          </div>
                        )}
                      </div>

                      {selectedReport.reportedEvidence && (
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reported User Evidence</h4>
                          <div className="text-xs text-rose-200 bg-rose-950/30 p-3 rounded-lg border border-rose-900/30 leading-relaxed">
                            {selectedReport.reportedEvidence}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Moderation Actions */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Immediate Enforcements</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        disabled={actionLoading[`${selectedReport.id}-warn`]}
                        onClick={() => handleReportAction(selectedReport.id, 'warn')}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-bold hover:bg-indigo-500 hover:text-white transition disabled:opacity-50"
                        title="Issues warning notification to the reported user"
                      >
                        <AlertTriangle size={14} /> Issue Warning
                      </button>
                      <button 
                        disabled={actionLoading[`${selectedReport.id}-suspend`]}
                        onClick={() => handleReportAction(selectedReport.id, 'suspend')}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-bold hover:bg-orange-500 hover:text-white transition disabled:opacity-50"
                        title="Suspends account temporarily (user status -> SUSPENDED)"
                      >
                        <Lock size={14} /> Temp Suspend
                      </button>
                      <button 
                        disabled={actionLoading[`${selectedReport.id}-ban`]}
                        onClick={() => handleReportAction(selectedReport.id, 'ban')}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                        title="Bans account permanently (user status -> BANNED)"
                      >
                        <Ban size={14} /> Permanent Ban
                      </button>
                      <button 
                        disabled={actionLoading[`${selectedReport.id}-reject`]}
                        onClick={() => handleReportAction(selectedReport.id, 'reject')}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
                        title="Dismisses report as rejected"
                      >
                        <X size={14} /> Dismiss Report
                      </button>
                    </div>
                  </div>

                  {/* Decisions Form */}
                  <form onSubmit={handleSaveChanges} className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Decisions & Case Log</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Case Status</label>
                        <select 
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Enforcement Action</label>
                        <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-medium">
                          {selectedReport.actionTaken || "NONE"}
                        </div>
                      </div>
                    </div>

                    {/* Response edit area (allows recording user interview) */}
                    {!selectedReport.reportedResponse && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Record Reported User Response</label>
                        <textarea
                          rows="2"
                          value={editResponse}
                          onChange={(e) => setEditResponse(e.target.value)}
                          placeholder="Type explanation provided by reported user during dispute review..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 leading-relaxed"
                        />
                      </div>
                    )}

                    {/* Admin notes */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Admin Investigation Notes</label>
                      <textarea
                        rows="3"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add private moderator notes, evidence findings, or reasoning for decision..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading[`${selectedReport.id}-update`]}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d8c3ff] to-[#bd91ff] text-[#2b1654] font-black text-xs uppercase tracking-widest hover:opacity-95 transition shadow-lg disabled:opacity-50"
                    >
                      {actionLoading[`${selectedReport.id}-update`] ? "Saving..." : "Save Case Decision & Notes"}
                    </button>
                  </form>

                </div>
              ) : (
                <div className="bg-slate-900/20 border border-slate-800/80 rounded-[24px] p-8 text-center h-[350px] flex flex-col items-center justify-center text-slate-500">
                  <MessageSquare size={36} className="text-slate-700 mb-3" />
                  <p className="text-xs font-bold text-slate-400">No Case Selected</p>
                  <p className="text-[10.5px] text-slate-500 max-w-[200px] mt-1.5 mx-auto leading-relaxed">
                    Select a report from the active queue to review disputant statements, logs, and enforce actions.
                  </p>
                </div>
              )}
            </section>

          </div>

        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 animate-[slideIn_0.3s_ease] ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertOctagon size={18} />}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

    </div>
  );
};

// Simple Chevron Icon Component
const ChevronRightIcon = ({ className }) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
  </svg>
);

export default AdminReports;

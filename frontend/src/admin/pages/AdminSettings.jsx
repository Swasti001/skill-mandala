import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { User, Shield, Sparkles, Bell, AlertTriangle, Eye, Link, Bold, Italic, PenLine, CheckCircle, AlertOctagon } from "lucide-react";
import adminApi from "../adminApi";

const Switch = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ${
      checked ? 'bg-[#c8a8ff]' : 'bg-slate-700'
    }`}
  >
    <span className="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-[16px]' : 'translate-x-0'
      }`}
    />
  </button>
);

const AdminSettings = () => {
  const [config, setConfig] = useState({
    platformName: "Skill Mandala",
    supportEmail: "ops@skillmandala.io",
    skillRelevanceWeight: 85,
    proximityBias: 40,
    matchingAlgorithm: "ENGINE V4.2-STABLE",
    publicDirectory: true,
    autoModeration: true,
    strictVerification: false,
    dailyDigests: true,
    matchingAlerts: true,
    marketingUpdates: false,
    announcementHtml: ""
  });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      const res = await adminApi.get("/admin/settings");
      setSettings(res.data);
      setConfig({
        platformName: res.data.platformName,
        supportEmail: res.data.supportEmail,
        skillRelevanceWeight: res.data.skillRelevanceWeight,
        proximityBias: res.data.proximityBias,
        matchingAlgorithm: res.data.matchingAlgorithm,
        publicDirectory: res.data.publicDirectory,
        autoModeration: res.data.autoModeration,
        strictVerification: res.data.strictVerification,
        dailyDigests: res.data.dailyDigests,
        matchingAlerts: res.data.matchingAlerts,
        marketingUpdates: res.data.marketingUpdates,
        announcementHtml: res.data.announcementHtml
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => setConfig(p => ({ ...p, [key]: !p[key] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminApi.put("/admin/settings", { ...config });
      showToast(res.data.message, "success");
    } catch (err) {
      showToast("Failed to save settings", "error");
    }
    setSaving(false);
  };

  const handleDiscard = () => {
    fetchSettings();
    showToast("Changes discarded", "success");
  };

  const handlePurgeCache = () => {
    showToast("Cache purged successfully!", "success");
  };

  const handleFactoryReset = () => {
    showToast("Factory reset is disabled in production", "error");
  };

  if (loading) return <div className="min-h-screen bg-[#0d121c] text-slate-50 font-sans flex items-center justify-center">Loading System Configuration...</div>;

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-50 font-sans pb-10">
      <AdminNavbar />

      <main className="ml-[200px] min-h-screen pt-20 px-8">
        <div className="max-w-[1000px] mx-auto space-y-6">
          
          {/* Header Row */}
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-white mb-1 leading-none">
                System Settings
              </h1>
              <p className="text-[14px] text-slate-400">
                Configure the core parameters and matching intelligence of the Skill Mandala ecosystem.
              </p>
              {settings && (
                <p className="text-[11px] text-slate-500 mt-1">
                  API {settings.apiVersion} · {settings.totalUsers} users · {settings.totalSessions} sessions · {settings.totalReports} reports
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={handleDiscard} className="px-6 py-2.5 rounded-xl border border-slate-700/60 bg-transparent text-[13px] font-bold text-slate-300 hover:bg-slate-800 transition">
                Discard Changes
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#c8a8ff] text-[#2b1654] text-[13px] font-bold shadow-[0_4px_20px_-4px_rgba(200,168,255,0.4)] hover:bg-[#b895f5] transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* System Profile */}
              <div className="bg-[#181e2d] border border-slate-700/40 rounded-[28px] p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <User size={18} className="text-slate-300" />
                  <h2 className="text-lg font-bold text-white">System Profile</h2>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-inner">
                      <div className="flex flex-col items-center">
                         <span className="text-2xl mb-1">↑</span>
                         <span className="text-[6px] tracking-[0.2em] font-bold uppercase text-teal-500/80">Platform<br/>Identity</span>
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-slate-700 rounded-full border-2 border-[#181e2d] flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg">
                      <PenLine size={12} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 ml-1">Organization Name</label>
                    <input 
                      type="text" 
                      value={config.platformName} 
                      onChange={(e) => handleConfigChange('platformName', e.target.value)}
                      className="w-full bg-[#121623] border border-slate-800 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#c8a8ff]/50 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 ml-1">Support Email</label>
                    <input 
                      type="email" 
                      value={config.supportEmail} 
                      onChange={(e) => handleConfigChange('supportEmail', e.target.value)}
                      className="w-full bg-[#121623] border border-slate-800 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#c8a8ff]/50 transition" 
                    />
                  </div>
                </div>
              </div>

              {/* Platform Rules */}
              <div className="bg-[#181e2d] border border-slate-700/40 rounded-[28px] p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <Shield size={18} className="text-slate-300" />
                  <h2 className="text-lg font-bold text-white">Platform Rules</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h3 className="text-[13px] font-bold text-white mb-0.5">Public Directory</h3>
                      <p className="text-[11px] text-slate-400">Allow unauthenticated users to browse skills</p>
                    </div>
                    <Switch checked={config.publicDirectory} onChange={() => handleToggle('publicDirectory')} />
                  </div>
                  
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h3 className="text-[13px] font-bold text-white mb-0.5">Auto-Moderation</h3>
                      <p className="text-[11px] text-slate-400">AI-driven flagging for session descriptions</p>
                    </div>
                    <Switch checked={config.autoModeration} onChange={() => handleToggle('autoModeration')} />
                  </div>
                  
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h3 className="text-[13px] font-bold text-white mb-0.5">Strict Verification</h3>
                      <p className="text-[11px] text-slate-400">Mandatory KYC for premium mentors</p>
                    </div>
                    <Switch checked={config.strictVerification} onChange={() => handleToggle('strictVerification')} />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Algorithm Tuning & Announcements */}
              <div className="bg-[#181e2d] border border-slate-700/40 rounded-[28px] p-7 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-slate-300" />
                    <h2 className="text-lg font-bold text-white">Algorithm Tuning</h2>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full text-slate-300 shadow-sm">
                    {config.matchingAlgorithm || 'ENGINE V4.2-STABLE'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                     <div>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SKILL RELEVANCE WEIGHT</span>
                          <span className="text-[11px] font-bold text-white">{config.skillRelevanceWeight}%</span>
                       </div>
                       <input 
                        type="range"
                        min="0"
                        max="100"
                        value={config.skillRelevanceWeight}
                        onChange={(e) => handleConfigChange('skillRelevanceWeight', parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#c8a8ff]"
                       />
                     </div>
                     <div>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PROXIMITY BIAS</span>
                          <span className="text-[11px] font-bold text-white">{config.proximityBias}%</span>
                       </div>
                       <input 
                        type="range"
                        min="0"
                        max="100"
                        value={config.proximityBias}
                        onChange={(e) => handleConfigChange('proximityBias', parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#c8a8ff]"
                       />
                     </div>
                  </div>

                  <div className="space-y-5">
                     <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Matching API Key</label>
                        <div className="relative">
                           <input type="password" defaultValue="sk_live_1234567890abcdef" className="w-full bg-[#121623] border border-slate-800 rounded-xl px-4 py-2.5 text-[13px] text-slate-400 focus:outline-none focus:border-[#c8a8ff]/50 pr-10 tracking-[0.2em] font-mono" />
                           <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                             <Eye size={14} />
                           </button>
                        </div>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Fallback Endpoint</label>
                        <input type="text" defaultValue="https://api.skillmandala.ai/v1/lega" className="w-full bg-[#121623] border border-slate-800 rounded-xl px-4 py-2.5 text-[12px] text-slate-400 focus:outline-none focus:border-[#c8a8ff]/50 truncate font-mono" />
                     </div>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">GLOBAL SYSTEM ANNOUNCEMENT</h3>
                    <div className="flex gap-3 text-slate-400">
                      <button className="hover:text-white transition"><Bold size={14} /></button>
                      <button className="hover:text-white transition"><Italic size={14} /></button>
                      <button className="hover:text-white transition"><Link size={14} /></button>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-[#121623] border border-slate-800 rounded-xl p-4 text-[13px] text-slate-300 leading-relaxed min-h-[100px] font-medium outline-none focus-within:border-[#c8a8ff]/30 transition" 
                    contentEditable 
                    suppressContentEditableWarning
                    onBlur={(e) => handleConfigChange('announcementHtml', e.target.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: config.announcementHtml || "Welcome to the <span class=\"text-[#c8a8ff] font-bold\">Q4 Upgrade</span> of Skill Mandala." }}
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-[#181e2d] border border-slate-700/40 rounded-[28px] p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <Bell size={18} className="text-slate-300" />
                  <h2 className="text-lg font-bold text-white">Notification Architecture</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Email */}
                   <div className="bg-[#121623] border border-slate-800/80 rounded-2xl p-5">
                     <h3 className="text-[13px] font-bold text-white mb-5 flex items-center gap-2">
                        <span className="text-indigo-400">@</span> Email Delivery
                        {settings?.emailDelivery && <span className="text-[8px] font-bold uppercase text-emerald-400 ml-auto">{settings.emailDelivery}</span>}
                     </h3>
                     
                     <div className="space-y-4">
                       <div className="flex justify-between items-center">
                         <span className="text-[12px] text-slate-300">Daily Digests</span>
                         <Switch checked={config.dailyDigests} onChange={() => handleToggle('dailyDigests')} />
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[12px] text-slate-300">Matching Alerts</span>
                         <Switch checked={config.matchingAlerts} onChange={() => handleToggle('matchingAlerts')} />
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[12px] text-slate-500">Marketing Updates</span>
                         <Switch checked={config.marketingUpdates} onChange={() => handleToggle('marketingUpdates')} />
                       </div>
                     </div>
                   </div>

                   {/* Webhooks */}
                   <div className="bg-[#121623] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
                     <div>
                       <h3 className="text-[13px] font-bold text-white mb-5 flex items-center gap-2">
                          <span className="text-indigo-400">&lt;/&gt;</span> API Webhooks
                       </h3>
                       
                       <div className="space-y-4">
                         <div className="flex justify-between items-center bg-slate-900/50 py-1.5 px-3 rounded-lg border border-slate-800">
                           <span className="text-[12px] text-slate-300">Slack Integration</span>
                           <span className="text-[9px] font-bold tracking-wider text-emerald-400 uppercase">{settings?.webhookStatus || 'CONNECTED'}</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-900/50 py-1.5 px-3 rounded-lg border border-slate-800">
                           <span className="text-[12px] text-slate-500">Discord Bot</span>
                           <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">DISABLED</span>
                         </div>
                       </div>
                     </div>

                     <button onClick={() => showToast("Webhook configuration saved", "success")} className="w-full mt-6 py-2 border border-slate-700 rounded-lg text-[11px] font-bold tracking-wider text-slate-300 hover:bg-slate-800 transition">
                       CONFIGURE WEBHOOKS
                     </button>
                   </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-[#241724]/60 border border-red-500/20 rounded-[24px] p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div>
                    <h3 className="text-[16px] font-bold text-red-400 mb-1 flex items-center gap-2">
                       Danger Zone
                    </h3>
                    <p className="text-[12px] text-slate-400 leading-relaxed max-w-sm">
                      Irreversible actions that affect the entire Skill Mandala ecosystem. Proceed with absolute caution.
                    </p>
                 </div>
                 <div className="flex flex-col gap-3 shrink-0">
                    <button onClick={handlePurgeCache} className="px-6 py-2 rounded-xl border border-red-500/30 text-[12px] font-bold text-red-300 hover:bg-red-500/10 transition">
                      Purge Cache
                    </button>
                    <button onClick={handleFactoryReset} className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-[12px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition">
                      Factory Reset System
                    </button>
                 </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertOctagon size={20} />}
          <span className="text-[13px] font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;

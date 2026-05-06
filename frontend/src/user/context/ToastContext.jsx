import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-sm px-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ y: -20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-[24px] shadow-2xl border backdrop-blur-xl
                ${
                  toast.type === "error"
                    ? "bg-red-950/90 border-red-500/50 text-red-100"
                    : toast.type === "info"
                    ? "bg-slate-900/90 border-slate-700/50 text-slate-100"
                    : "bg-indigo-950/90 border-indigo-500/50 text-indigo-100"
                }
              `}
            >
              <div className="flex-shrink-0">
                {toast.type === "error" ? (
                  <AlertCircle size={20} className="text-red-400" />
                ) : toast.type === "info" ? (
                  <Info size={20} className="text-slate-400" />
                ) : (
                  <CheckCircle size={20} className="text-emerald-400" />
                )}
              </div>
              <p className="flex-1 text-[13px] font-black uppercase tracking-tight leading-tight">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="hover:opacity-60 transition-opacity"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

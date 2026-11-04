import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const activeTimersRef = useRef({});

  const removeToast = useCallback((id) => {
    if (activeTimersRef.current[id]) {
      clearTimeout(activeTimersRef.current[id]);
      delete activeTimersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    if (!message || typeof message !== 'string') return;
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    setToasts((prev) => {
      // Rule 1: No message should appear multiple times. If it already exists, do not duplicate!
      const existingToast = prev.find((t) => t.message === cleanMessage);
      if (existingToast) {
        if (duration > 0) {
          if (activeTimersRef.current[existingToast.id]) {
            clearTimeout(activeTimersRef.current[existingToast.id]);
          }
          activeTimersRef.current[existingToast.id] = setTimeout(() => {
            removeToast(existingToast.id);
          }, duration);
        }
        return prev;
      }

      // Rule 2: If it's a different message, show it (limit max 3 simultaneous toasts)
      const id = Date.now().toString() + Math.random().toString().slice(2, 6);

      if (duration > 0) {
        activeTimersRef.current[id] = setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      const truncatedList = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
      return [...truncatedList, { id, message: cleanMessage, type }];
    });
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-card border backdrop-blur-md ${
                toast.type === 'error'
                  ? 'bg-red-50/95 border-red-200 text-red-900'
                  : toast.type === 'info'
                  ? 'bg-blue-50/95 border-blue-200 text-blue-900'
                  : 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : toast.type === 'info' ? (
                  <Info className="w-5 h-5 text-blue-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                )}
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

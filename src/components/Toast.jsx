import React, { useState, useCallback } from "react";

// Create a context for toast notifications
export const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-xl backdrop-blur-lg shadow-lg text-white flex items-center justify-between min-w-xs animate-in fade-in slide-in-from-right-4 duration-300 ${
            toast.type === "success"
              ? "bg-green-600 dark:bg-green-700"
              : toast.type === "error"
              ? "bg-red-600 dark:bg-red-700"
              : toast.type === "warning"
              ? "bg-yellow-600 dark:bg-yellow-700"
              : "bg-cyan-600 dark:bg-cyan-700"
          }`}
        >
          <span className="text-sm sm:text-base flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-3 text-white hover:text-gray-200 shrink-0 transition-all"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

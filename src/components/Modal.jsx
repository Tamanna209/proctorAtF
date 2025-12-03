import React from "react";

export function Modal({ isOpen, title, message, buttons, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-3xl bg-white/70 dark:bg-slate-900/85 border border-cyan-200/60 dark:border-cyan-500/25 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-3xl dark:shadow-4xl animate-in fade-in zoom-in-95 duration-300 hover:shadow-4xl dark:hover:shadow-5xl transition-all">
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
            {title}
          </h2>
        )}
        {message && (
          <p className="mb-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            {message}
          </p>
        )}
        <div className="flex gap-3 justify-end flex-wrap">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => {
                btn.onClick();
                onClose();
              }}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                btn.variant === "primary"
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                  : btn.variant === "success"
                  ? "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

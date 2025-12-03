import React from "react";

export function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border-t border-cyan-200/50 dark:border-cyan-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              © 2025 NCPL Proctor. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Developed by
            </span>
            <a
              href="#"
              className="text-xs sm:text-sm font-semibold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent hover:opacity-75 transition-opacity"
            >
              Tamanna Walia
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

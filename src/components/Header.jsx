import React, { useState, useEffect } from "react";
import logo from "./logo.jpg";
export function Header() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or default to false (light mode)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.body.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.body.style.colorScheme = "light";
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <header className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border-b border-cyan-200/50 dark:border-cyan-500/20 sticky top-0 z-40 shadow-lg dark:shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
         
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            NCPL Proctor
          </h1>
        </div>
{/* 
        <button
          onClick={toggleDarkMode}
          className="p-2 sm:p-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-md bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/30 hover:border-cyan-300/50 dark:hover:border-cyan-500/30"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.122a4 4 0 111.414-1.414l2.121 2.122a1 1 0 111.414-1.414zM15.5 1a1 1 0 011 1v2a1 1 0 11-2 0V2a1 1 0 011-1zM4.461 4.387l1.414-1.414a1 1 0 00-1.414-1.414L3.047 2.973a1 1 0 000 1.414zm7.07 7.07l1.414-1.414a1 1 0 10-1.414-1.414l-1.414 1.414a1 1 0 001.414 1.414zM1 11a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button> */}
      </div>
    </header>
  );
}

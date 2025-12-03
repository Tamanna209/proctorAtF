import React from "react";
import { useNavigate } from "react-router-dom";

export default function Blocked() {
  const nav = useNavigate();

  const handleBackToRegister = () => {
    localStorage.removeItem("SESSION_TOKEN");
    localStorage.removeItem("USER_ID");
    nav("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-ice-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 px-4 py-12">
      <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-red-200/60 dark:border-red-500/20 rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-10 text-center max-w-md hover:border-red-300/80 dark:hover:border-red-500/30 transition-all">
        <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
          🚫 Access Denied
        </h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          You have been blocked due to suspicious activity during the test. This
          account is no longer eligible for this test.
        </p>
        <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          If you believe this is a mistake, please contact the administrator.
        </p>
        <button
          onClick={handleBackToRegister}
          className="mt-6 w-full px-6 py-2.5 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 dark:from-red-500 dark:to-pink-500 dark:hover:from-red-600 dark:hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Back to Register
        </button>
      </div>
    </div>
  );
}

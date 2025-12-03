import React from "react";
import { useNavigate } from "react-router-dom";

export default function TestFinished() {
  const nav = useNavigate();

  const handleGoHome = () => {
    localStorage.removeItem("SESSION_TOKEN");
    localStorage.removeItem("USER_ID");
    nav("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-ice-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 px-4 py-12">
      <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-10 text-center max-w-md hover:border-cyan-300/80 dark:hover:border-cyan-500/30 transition-all">
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
          Test Submitted
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          Thank you for completing the test. Your answers have been recorded.
        </p>
        <button
          onClick={handleGoHome}
          className="mt-6 w-full px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

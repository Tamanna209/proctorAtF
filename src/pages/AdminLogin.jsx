import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAdminPasskey } from "../api/admin";
import { useToast } from "../components/Toast";

export default function AdminLogin() {
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await verifyAdminPasskey(passkey);
      const token = res.data.adminToken;

      // Store admin token in localStorage
      localStorage.setItem("ADMIN_TOKEN", token);

      addToast("✅ Admin authenticated successfully", "success", 2000);

      // Navigate to admin dashboard
      setTimeout(() => {
        nav("/admin/results");
      }, 1500);
    } catch (err) {
      addToast(err?.response?.data?.message || "Invalid passkey", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-ice-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 px-4 sm:px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-8 hover:shadow-3xl dark:hover:shadow-4xl transition-all duration-300 hover:border-cyan-300/80 dark:hover:border-cyan-500/30"
      >
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            🔐 Admin Access
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the passkey to view test results
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Passkey
          </label>
          <input
            required
            type="password"
            placeholder="Enter admin passkey"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            className="w-full px-4 py-2.5 text-gray-900 dark:text-white backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-500/20 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            "🔓 Access Results"
          )}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Only authorized administrators can access this section
        </p>
      </form>
    </div>
  );
}

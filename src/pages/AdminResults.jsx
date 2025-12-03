import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTestResults } from "../api/admin";
import { useToast } from "../components/Toast";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const { addToast } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchResults = async () => {
      try {
        const adminToken = localStorage.getItem("ADMIN_TOKEN");

        if (!adminToken) {
          nav("/admin/login");
          return;
        }

        const res = await getTestResults(adminToken);
        setResults(res.data.results || []);
        setLoading(false);
      } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem("ADMIN_TOKEN");
          nav("/admin/login");
        } else {
          setError(err?.response?.data?.message || "Failed to fetch results");
          addToast("Failed to load results", "error");
        }
        setLoading(false);
      }
    };

    fetchResults();
  }, [nav, addToast]);

  const handleLogout = () => {
    localStorage.removeItem("ADMIN_TOKEN");
    nav("/admin/login");
    addToast("Logged out successfully", "info", 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-ice-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
        <div className="text-center">
          <svg
            className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-600"
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
          <p className="text-gray-700 dark:text-gray-300">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-ice-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-100 to-blue-300  bg-clip-text text-transparent">
              Test Results Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Students:{" "}
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                {results.length}
              </span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-600 rounded-xl p-4 mb-6 text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {results.length === 0 ? (
          <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              No test results yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-3xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-200/40 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-slate-800/50">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Student Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      College
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Result
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Correct/Wrong/Unanswered
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, idx) => (
                    <tr
                      key={result._id}
                      className={`border-b border-cyan-200/30 dark:border-cyan-500/10 transition-all duration-300 ${
                        result.isCheating
                          ? "bg-red-100/50 dark:bg-red-900/30 hover:bg-red-100/70 dark:hover:bg-red-900/40  hover:blur-none"
                          : "hover:bg-cyan-50/50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result.studentName}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {result.email}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {result.phone}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {result.college}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg ${
                            result.isCheating
                              ? "bg-red-600 dark:bg-red-700 text-white"
                              : result.percentage >= 70
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                              : result.percentage >= 50
                              ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400"
                              : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {result.isCheating
                            ? result.isBlocked
                              ? "CHEATING ATTEMPTED"
                              : "CHEATING"
                            : result.score}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold">
                        {result.isCheating ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 dark:bg-red-700 text-white rounded-lg animate-pulse">
                            CHEATING
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-green-600 dark:text-green-400">
                              {result.correct} Correct
                            </span>
                            <span className="text-red-600 dark:text-red-400">
                              {result.wrong} Wrong
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {result.unanswered} Unanswered
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold">
                        {result.isCheating ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 dark:bg-red-700 text-white rounded-lg animate-pulse">
                            CHEATING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded-lg">
                            Clean
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="backdrop-blur-lg bg-green-100/50 dark:bg-green-900/30 border border-green-300/50 dark:border-green-700/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  ✅ Clean Submission
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  No suspicious activity detected
                </p>
              </div>
              <div className="backdrop-blur-lg bg-red-100/50 dark:bg-red-900/30 border border-red-300/50 dark:border-red-700/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  🚨 Cheating Detected
                </p>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  Suspicious activity during test
                </p>
              </div>
              <div className="backdrop-blur-lg bg-cyan-100/50 dark:bg-cyan-900/30 border border-cyan-300/50 dark:border-cyan-700/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">
                  📊 Row Highlighting
                </p>
                <p className="text-xs text-cyan-700 dark:text-cyan-400 mt-1">
                  Cheating rows show with red blur effect
                </p>
              </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

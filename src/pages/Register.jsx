import React, { useState } from "react";
import { sendOtp } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    technology: "",
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Frontend validation: phone must be exactly 10 digits
      // and email domain must be one of allowed domains
      const phoneClean = (form.phone || "").replace(/\D/g, "");
      if (!/^\d{10}$/.test(phoneClean)) {
        addToast("Phone number must be exactly 10 digits.", "error");
        setLoading(false);
        return;
      }

      const allowedDomains = [
        "service.com",
        "gmail.com",
        "outlook.com",
        "yahoo.com",
      ];
      const emailVal = (form.email || "").toLowerCase().trim();
      const domain = emailVal.split("@")[1] || "";
      if (!domain || !allowedDomains.includes(domain)) {
        addToast(
          `Email domain must be one of: ${allowedDomains.join(", ")}`,
          "error"
        );
        setLoading(false);
        return;
      }

      // ensure form.phone is the cleaned digits
      const payload = { ...form, phone: phoneClean, email: emailVal };

      await sendOtp(payload);
      // store email/phone to used in verify page
      sessionStorage.setItem("register_email", payload.email);
      sessionStorage.setItem("register_phone", payload.phone);
      addToast("OTP sent to your email", "success", 2000);
      // Auto-navigate after showing toast
      setTimeout(() => nav("/verify-otp"), 1500);
    } catch (err) {
      addToast(err?.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-8 hover:shadow-3xl dark:hover:shadow-4xl transition-all duration-300 hover:border-cyan-300/80 dark:hover:border-cyan-500/30"
      >
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Register
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Join NCPL Proctor and take your test
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              required
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-900 dark:text-white backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-500/20 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              required
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-900 dark:text-white backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-500/20 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              required
              placeholder="10-digit phone number"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              className="w-full px-4 py-2.5 text-gray-900 dark:text-white backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-500/20 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College
            </label>
            <input
              placeholder="Your college name"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-900 dark:text-white backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-500/20 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Technologies (Optional)
            </label>
            <input
              placeholder="e.g., Python, JavaScript, etc."
              value={form.technology}
              onChange={(e) => setForm({ ...form, technology: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-900 dark:text-white backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-500/20 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full mt-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
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
              Sending OTP...
            </span>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { verifyOtp, createSession } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Modal } from "../components/Modal";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const email = sessionStorage.getItem("register_email");
  const phone = sessionStorage.getItem("register_phone");
  const nav = useNavigate();
  const { addToast } = useToast();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("[VerifyOtp] Starting OTP verification for email:", email);

      const res = await verifyOtp({ email, otp });
      console.log("[VerifyOtp] OTP verified, response:", res.data);

      // backend returns { message, userId }
      const userId = res?.data?.userId;

      if (!userId) {
        console.error("[VerifyOtp] User ID not received from backend");
        addToast("User ID not received from server", "error");
        setLoading(false);
        return;
      }

      console.log("[VerifyOtp] Saving USER_ID to localStorage:", userId);
      localStorage.setItem("USER_ID", userId);

      // create session + store session token
      try {
        console.log("[VerifyOtp] Creating session for userId:", userId);
        const sessionRes = await createSession({ userId });
        console.log("[VerifyOtp] Session created, response:", sessionRes.data);

        const token = sessionRes?.data?.token;

        if (!token) {
          console.error("[VerifyOtp] No session token received");
          addToast("Failed to create session", "error");
          setLoading(false);
          return;
        }

        console.log("[VerifyOtp] Saving SESSION_TOKEN to localStorage:", token);
        localStorage.setItem("SESSION_TOKEN", token);

        // Verify both tokens are stored before navigating
        const storedUserId = localStorage.getItem("USER_ID");
        const storedToken = localStorage.getItem("SESSION_TOKEN");

        console.log(
          "[VerifyOtp] Verification check - userId stored:",
          !!storedUserId,
          "token stored:",
          !!storedToken
        );

        if (!storedUserId || !storedToken) {
          console.error("[VerifyOtp] Failed to verify tokens in localStorage");
          addToast("Failed to save session data", "error");
          setLoading(false);
          return;
        }

        console.log("[VerifyOtp] All tokens verified, showing success modal");
        setShowSuccessModal(true);

        // Navigate after modal is shown
        setTimeout(() => {
          console.log("[VerifyOtp] Navigating to /start-test");
          nav("/start-test");
        }, 2000);
      } catch (sessionErr) {
        console.error("[VerifyOtp] Session creation error:", sessionErr);
        // Clear USER_ID if session creation fails
        localStorage.removeItem("USER_ID");
        addToast(
          sessionErr?.response?.data?.message ||
            "Failed to create session. Please try again.",
          "error"
        );
        setLoading(false);
      }
    } catch (err) {
      console.error("[VerifyOtp] OTP verification error:", err);
      addToast(err?.response?.data?.message || "OTP verify failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <Modal
        isOpen={showSuccessModal}
        title="✅ Verified Successfully!"
        message="You are logged in. Redirecting to test..."
        buttons={[
          {
            label: "Continue",
            variant: "success",
            onClick: () => nav("/start-test"),
          },
        ]}
        onClose={() => {}}
      />
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-8 hover:shadow-3xl dark:hover:shadow-4xl transition-all duration-300 hover:border-cyan-300/80 dark:hover:border-cyan-500/30"
      >
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            OTP Code
          </label>
          <input
            required
            maxLength="6"
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest text-gray-900 dark:text-white backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border-2 border-cyan-200/50 dark:border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Check your email for the OTP code
          </p>
        </div>

        <button
          disabled={loading || otp.length !== 6}
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
            "Verify & Continue"
          )}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Didn't receive the code? Check your spam folder
        </p>
      </form>
    </div>
  );
}

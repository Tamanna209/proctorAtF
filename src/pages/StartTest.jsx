// import React, { useEffect, useState } from "react";
// import { createSession } from "../api/auth";
// import { useNavigate } from "react-router-dom";
// import { checkAttemptApi } from "../api/test";
// import { useToast } from "../components/Toast";
// import { Modal } from "../components/Modal";

// export default function StartTest() {
//   const nav = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [modal, setModal] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     buttons: [],
//   });
//   // const userId = localStorage.getItem("USER_ID");
//   // const sessionToken = localStorage.getItem("SESSION_TOKEN");
//   const [userId, setUserId] = useState(null);
// const [sessionToken, setSessionToken] = useState(null);

// useEffect(() => {
//   setUserId(localStorage.getItem("USER_ID"));
//   setSessionToken(localStorage.getItem("SESSION_TOKEN"));
// }, []);

//   const { addToast } = useToast();

//   // Helper to request permissions without proctoring listeners
//   const ensurePermissions = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       stream.getTracks().forEach((t) => t.stop());
//       return true;
//     } catch (err) {
//       return false;
//     }
//   };

//   useEffect(() => {
//     console.log("[StartTest] useEffect - checking session tokens");
//     console.log("[StartTest] userId from localStorage:", userId);
//     console.log("[StartTest] sessionToken from localStorage:", sessionToken);

//     // Check if both user ID and session token exist
//     if (!userId || !sessionToken) {
//       console.warn("[StartTest] Session check failed - redirecting to home");
//       addToast("Session expired. Please login again", "error");
//       nav("/");
//     } else {
//       console.log("[StartTest] Session check passed - tokens exist");
//     }
//   }, [userId, sessionToken, nav, addToast]);

//   const handleStart = async () => {
//     setLoading(true);
//     try {
//       // ensure camera + mic permissions before creating a session
//       const ok = await ensurePermissions();
//       if (!ok) {
//         setModal({
//           isOpen: true,
//           title: "Permission Required",
//           message: "Camera and microphone are required to start the test.",
//           buttons: [{ label: "OK", variant: "primary", onClick: () => {} }],
//         });
//         setLoading(false);
//         return;
//       }
//       // re-create session in case old expired
//       const res = await createSession({ userId });
//       const token = res.data.token;
//       localStorage.setItem("SESSION_TOKEN", token);

//       // check attempt or blocked via /test/status
//       const statusRes = await checkAttemptApi(token);
//       if (statusRes.data?.isBlocked) {
//         setModal({
//           isOpen: true,
//           title: "Account Blocked",
//           message: "You are blocked from taking the test.",
//           buttons: [
//             {
//               label: "Go Back",
//               variant: "primary",
//               onClick: () => {
//                 localStorage.removeItem("SESSION_TOKEN");
//                 localStorage.removeItem("USER_ID");
//                 nav("/register");
//               },
//             },
//           ],
//         });
//         return;
//       }
//       if (statusRes.data?.hasAttempted) {
//         setModal({
//           isOpen: true,
//           title: "Already Attempted",
//           message: "You have already attempted this test.",
//           buttons: [
//             {
//               label: "Go Back",
//               variant: "primary",
//               onClick: () => {
//                 localStorage.removeItem("SESSION_TOKEN");
//                 localStorage.removeItem("USER_ID");
//                 nav("/register");
//               },
//             },
//           ],
//         });
//         return;
//       }

//       nav("/test-screen");
//     } catch (err) {
//       const msg = err?.response?.data?.message || "Unable to create session";
//       if (err?.response?.status === 403) nav("/blocked");
//       addToast(msg, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
//       <Modal
//         isOpen={modal.isOpen}
//         title={modal.title}
//         message={modal.message}
//         buttons={modal.buttons}
//         onClose={() => setModal({ ...modal, isOpen: false })}
//       />
//       <div className="w-full max-w-2xl">
//         <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-10 hover:shadow-3xl dark:hover:shadow-4xl transition-all duration-300 hover:border-cyan-300/80 dark:hover:border-cyan-500/30">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
//               Ready to Start?
//             </h1>
//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
//               Make sure you have a quiet space and stable internet connection
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//             <div className="backdrop-blur-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-200/40 dark:border-cyan-500/20 rounded-xl p-4 hover:border-cyan-300/60 dark:hover:border-cyan-500/40 transition-all">
//               <div className="text-3xl mb-2">⏱️</div>
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                 Duration
//               </p>
//               <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
//                 15 mins
//               </p>
//             </div>
//             <div className="backdrop-blur-lg bg-blue-500/10 dark:bg-blue-400/10 border border-blue-200/40 dark:border-blue-500/20 rounded-xl p-4 hover:border-blue-300/60 dark:hover:border-blue-500/40 transition-all">
//               <div className="text-3xl mb-2">📷 </div>
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                 Requirements
//               </p>
//               <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
//                 Camera & Mic
//               </p>
//             </div>
//             <div className="backdrop-blur-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-200/40 dark:border-amber-500/20 rounded-xl p-4 hover:border-amber-300/60 dark:hover:border-amber-500/40 transition-all">
//               <div className="text-3xl mb-2">⚠️</div>
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                 Rules
//               </p>
//               <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
//                 No tab switch
//               </p>
//             </div>
//           </div>

//           <div className="bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-700/40 rounded-xl p-4 mb-8">
//             <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
//               <strong>Important:</strong> Cheating detection is active. Any
//               suspicious activity (tab switch, camera off, minimize) will result
//               in blocking.
//             </p>
//           </div>

//           <button
//             onClick={handleStart}
//             disabled={loading}
//             className="w-full py-3 px-6 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg
//                   className="w-5 h-5 animate-spin"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Starting Test...
//               </span>
//             ) : (
//               " Start Test"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { createSession } from "../api/auth";
// import { useNavigate } from "react-router-dom";
// import { checkAttemptApi } from "../api/test";
// import { useToast } from "../components/Toast";
// import { Modal } from "../components/Modal";

// export default function StartTest() {
//   const nav = useNavigate();
//   const { addToast } = useToast();

//   const [loading, setLoading] = useState(false);
//   const [modal, setModal] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     buttons: [],
//   });

//   // FIX: LocalStorage values must load after mount (iPhone issue)
//   const [userId, setUserId] = useState(null);
//   const [sessionToken, setSessionToken] = useState(null);

//   // Load localStorage AFTER component mounts (Safari safe)
//   useEffect(() => {
//     const uid = localStorage.getItem("USER_ID");
//     const st = localStorage.getItem("SESSION_TOKEN");

//     console.log("[StartTest] Loaded from localStorage:", { uid, st });

//     setUserId(uid);
//     setSessionToken(st);
//   }, []);

//   // Wait until the values are loaded (avoid null on iPhone)
//   useEffect(() => {
//     if (userId === null || sessionToken === null) return; // Wait

//     console.log("[StartTest] Final check -", userId, sessionToken);

//     if (!userId || !sessionToken) {
//       addToast("Session expired. Please login again", "error");
//       nav("/register");
//     }
//   }, [userId, sessionToken, addToast, nav]);

//   // Permissions helper
//   const ensurePermissions = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       stream.getTracks().forEach((t) => t.stop());
//       return true;
//     } catch (err) {
//       return false;
//     }
//   };

//   const handleStart = async () => {
//     setLoading(true);

//     try {
//       // Permission check
//       const ok = await ensurePermissions();
//       if (!ok) {
//         setModal({
//           isOpen: true,
//           title: "Permission Required",
//           message: "Camera and microphone are required to start the test.",
//           buttons: [{ label: "OK", variant: "primary", onClick: () => {} }],
//         });
//         setLoading(false);
//         return;
//       }

//       // Create new session
//       const res = await createSession({ userId });
//       const token = res.data.token;

//       localStorage.setItem("SESSION_TOKEN", token);
//       setSessionToken(token);

//       // Check attempt
//       const statusRes = await checkAttemptApi(token);

//       if (statusRes.data?.isBlocked) {
//         setModal({
//           isOpen: true,
//           title: "Account Blocked",
//           message: "You are blocked from taking the test.",
//           buttons: [
//             {
//               label: "Go Back",
//               variant: "primary",
//               onClick: () => {
//                 localStorage.removeItem("SESSION_TOKEN");
//                 localStorage.removeItem("USER_ID");
//                 nav("/register");
//               },
//             },
//           ],
//         });
//         return;
//       }

//       if (statusRes.data?.hasAttempted) {
//         setModal({
//           isOpen: true,
//           title: "Already Attempted",
//           message: "You have already attempted this test.",
//           buttons: [
//             {
//               label: "Go Back",
//               variant: "primary",
//               onClick: () => {
//                 localStorage.removeItem("SESSION_TOKEN");
//                 localStorage.removeItem("USER_ID");
//                 nav("/register");
//               },
//             },
//           ],
//         });
//         return;
//       }

//       nav("/test-screen");
//     } catch (err) {
//       const msg = err?.response?.data?.message || "Unable to create session";
//       if (err?.response?.status === 403) nav("/blocked");
//       addToast(msg, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
//       <Modal
//         isOpen={modal.isOpen}
//         title={modal.title}
//         message={modal.message}
//         buttons={modal.buttons}
//         onClose={() => setModal({ ...modal, isOpen: false })}
//       />

//       <div className="w-full max-w-2xl">
//         <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-10 hover:shadow-3xl dark:hover:shadow-4xl transition-all duration-300 hover:border-cyan-300/80 dark:hover:border-cyan-500/30">

//           <div className="text-center mb-8">
//             <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
//               Ready to Start?
//             </h1>
//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
//               Make sure you have a quiet space and stable internet connection
//             </p>
//           </div>

//           <button
//             onClick={handleStart}
//             disabled={loading}
//             className="w-full py-3 px-6 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg"
//           >
//             {loading ? "Starting Test..." : "Start Test"}
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { createSession } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { checkAttemptApi } from "../api/test";
import { useToast } from "../components/Toast";
import { Modal } from "../components/Modal";

export default function StartTest() {
  const nav = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    buttons: [],
  });

  // iPhone-Safe localStorage values
  const [userId, setUserId] = useState(undefined);
  const [sessionToken, setSessionToken] = useState(undefined);

  // Load LS AFTER component mounts (Safari fix)
  useEffect(() => {
    const uid = localStorage.getItem("USER_ID");
    const st = localStorage.getItem("SESSION_TOKEN");

    console.log("[StartTest] Loaded:", { uid, st });

    setUserId(uid ?? "");
    setSessionToken(st ?? "");
  }, []);

  // Only run this validation AFTER values are fully loaded
  useEffect(() => {
    if (userId === undefined || sessionToken === undefined) return;

    // NOTHING TO DO HERE — no redirect!
    // Redirect should only happen when the user tries to start test.
  }, [userId, sessionToken]);

  // ===== Permission Helper =====
  const ensurePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch (err) {
      return false;
    }
  };

  // ===== Start Button =====
  const handleStart = async () => {
    if (!userId) {
      addToast("Session expired. Please login again.", "error");
      nav("/register");
      return;
    }

    setLoading(true);

    try {
      // Permission check
      const ok = await ensurePermissions();
      if (!ok) {
        setModal({
          isOpen: true,
          title: "Permission Required",
          message: "Camera and microphone are required to start the test.",
          buttons: [{ label: "OK", variant: "primary", onClick: () => {} }],
        });
        setLoading(false);
        return;
      }

      // Create session
      const res = await createSession({ userId });
      const token = res?.data?.token;
      console.log("[StartTest] Session Created:", token);

      localStorage.setItem("SESSION_TOKEN", token);
      setSessionToken(token);

      // API check
      const statusRes = await checkAttemptApi(token);

      if (statusRes.data?.isBlocked) {
        setModal({
          isOpen: true,
          title: "Account Blocked",
          message: "You are blocked from taking the test.",
          buttons: [
            {
              label: "Go Back",
              variant: "primary",
              onClick: () => {
                localStorage.removeItem("SESSION_TOKEN");
                localStorage.removeItem("USER_ID");
                nav("/register");
              },
            },
          ],
        });
        return;
      }

      if (statusRes.data?.hasAttempted) {
        setModal({
          isOpen: true,
          title: "Already Attempted",
          message: "You have already attempted this test.",
          buttons: [
            {
              label: "Go Back",
              variant: "primary",
              onClick: () => {
                localStorage.removeItem("SESSION_TOKEN");
                localStorage.removeItem("USER_ID");
                nav("/register");
              },
            },
          ],
        });
        return;
      }

      nav("/test-screen");
    } catch (err) {
      const msg = err?.response?.data?.message || "Unable to create session";
      if (err?.response?.status === 403) nav("/blocked");
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        buttons={modal.buttons}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />

      <div className="w-full max-w-2xl">
        <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl shadow-2xl p-6 sm:p-10 transition-all">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
              Ready to Start?
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Make sure you have a quiet space and stable internet connection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="backdrop-blur-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-200/40 dark:border-cyan-500/20 rounded-xl p-4 hover:border-cyan-300/60 dark:hover:border-cyan-500/40 transition-all">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Duration
              </p>
              <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                15 mins
              </p>
            </div>
            <div className="backdrop-blur-lg bg-blue-500/10 dark:bg-blue-400/10 border border-blue-200/40 dark:border-blue-500/20 rounded-xl p-4 hover:border-blue-300/60 dark:hover:border-blue-500/40 transition-all">
              <div className="text-3xl mb-2">📷 </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Requirements
              </p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                Camera & Mic
              </p>
            </div>
            <div className="backdrop-blur-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-200/40 dark:border-amber-500/20 rounded-xl p-4 hover:border-amber-300/60 dark:hover:border-amber-500/40 transition-all">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Rules
              </p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                No tab switch
              </p>
            </div>
          </div>

          <div className="bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-700/40 rounded-xl p-4 mb-8">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              <strong>Important:</strong> Cheating detection is active. Any
              suspicious activity (tab switch, camera off, minimize) will result
              in blocking.
            </p>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-3 px-6 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            {loading ? "Starting Test..." : "Start Test"}
          </button>
        </div>
      </div>
    </div>
  );
}

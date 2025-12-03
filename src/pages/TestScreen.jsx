import React, { useEffect, useState } from "react";
import { startTestApi, submitTestApi } from "../api/test";
import useProctorEvents from "../hooks/useProctorEvent";
import { useAdvancedProctoring } from "../hooks/useAdvancedProctoring";
import { sendProctorEvent } from "../api/proctor";
import { useRef } from "react";
import { useToast } from "../components/Toast";
import { Modal } from "../components/Modal";

export default function TestScreen() {
  const { addToast } = useToast();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Handle suspicious activity — block immediately and auto-submit
  const handleSuspiciousActivity = async (eventType, details) => {
    setIsBlocked(true);
    setBlockedReason(`⚠️ Suspicious Activity Detected: ${details}`);
    addToast(`Test Blocked: ${details}`, "error", 0);

    // Send blocking event to server
    try {
      await sendProctorEvent(sessionToken, {
        userId,
        eventType,
        details,
      });
    } catch (e) {
      // ignore network errors
    }

    // Auto-submit test after 2 seconds
    setTimeout(() => {
      doSubmit();
    }, 2000);
  };

  const { ensurePermissions } = useProctorEvents(handleSuspiciousActivity);
  const { requestFullscreen } = useAdvancedProctoring(handleSuspiciousActivity);
  const sessionToken = localStorage.getItem("SESSION_TOKEN");
  const userId = localStorage.getItem("USER_ID");
  const [testId, setTestId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [loading, setLoading] = useState(true);
  const streamRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        // Permissions already granted in StartTest; here we open a persistent stream
        // to detect if camera/mic is disabled mid-test
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        // when tracks end (user disables hardware), notify server and block
        stream.getTracks().forEach((track) => {
          track.addEventListener("ended", async () => {
            await handleSuspiciousActivity(
              "CAMERA_MIC_OFF",
              `${track.kind} disabled`
            );
          });
        });

        const res = await startTestApi(sessionToken);
        setTestId(res.data.testId);
        setQuestions(res.data.questions || []);

        // Request fullscreen mode for security
        setTimeout(() => {
          requestFullscreen().catch(() => {
            // Fullscreen request denied, but test can continue
            console.warn("Fullscreen request was denied");
          });
        }, 500);

        setLoading(false);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 403) return (window.location.href = "/blocked");
        if (status === 401) return (window.location.href = "/");
        alert(err?.response?.data?.message || "Failed to load questions");
      }
    })();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      doSubmit();
      return;
    }
    // Don't start timer if already blocked
    if (isBlocked) return;

    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isBlocked]);

  const doSubmit = async () => {
    try {
      const answers = Object.entries(selected).map(([qId, ans]) => {
        const question = questions.find((q) => q._id === qId);
        const selectedIndex = question ? question.options.indexOf(ans) : -1;
        return {
          questionId: qId,
          selectedIndex,
        };
      });

      await submitTestApi(sessionToken, {
        testId,
        answers,
        wasCheating: isBlocked,
        cheatingReason: blockedReason,
      });
      setShowSubmitModal(true);
    } catch (err) {
      if (err?.response?.status === 403)
        return (window.location.href = "/blocked");
      addToast("Submit failed. Please contact admin.", "error");
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem("SESSION_TOKEN");
    localStorage.removeItem("USER_ID");
    window.location.href = "/register";
  };

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading Test...
      </div>
    );
  if (!questions.length)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        No questions found.
      </div>
    );

  const q = questions[currentIndex];
  const formatTime = () => {
    const m = Math.floor(timeLeft / 60),
      s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-ice-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 px-4 sm:px-6 py-6 sm:py-8">
      <Modal
        isOpen={showSubmitModal}
        title="✅ Test Submitted Successfully!"
        message="Thank you for completing the test. Your answers have been recorded."
        buttons={[
          {
            label: "Go Home",
            variant: "success",
            onClick: handleGoHome,
          },
        ]}
        onClose={() => {}}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header - Fixed positioning for fullscreen */}
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border-b border-cyan-200/60 dark:border-cyan-500/20 px-4 sm:px-6 py-4 sm:py-5">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                Aptitude Test
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div
              className={`backdrop-blur-lg px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-center font-mono font-bold text-lg sm:text-xl whitespace-nowrap ${
                timeLeft < 60
                  ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 shadow-lg shadow-red-400/50"
                  : "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 shadow-lg shadow-cyan-200/30"
              }`}
            >
              <div className="text-xs opacity-75 mb-1">TIME LEFT</div>
              <div className="text-2xl sm:text-3xl text-white">
                {formatTime()}
              </div>
            </div>
          </div>
        </div>

        {/* Main content with top padding */}
        <div className="mt-24 sm:mt-28">
          {/* Blocked Alert */}
          {isBlocked && (
            <div className="mb-6 backdrop-blur-lg bg-red-100/80 dark:bg-red-900/40 border-2 border-red-500 dark:border-red-600 rounded-2xl p-4 sm:p-5 animate-pulse shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚨</span>
                <div className="flex-1">
                  <p className="text-red-900 dark:text-red-200 font-bold text-sm sm:text-base mb-1">
                    TEST SUSPENDED - CHEATING DETECTED
                  </p>
                  <p className="text-red-800 dark:text-red-300 font-semibold text-xs sm:text-sm">
                    {blockedReason}
                  </p>
                  <p className="text-red-700 dark:text-red-400 text-xs mt-2">
                    Your test is being auto-submitted and your account will be
                    blocked.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Question Card */}
          <div
            className={`backdrop-blur-2xl bg-white/60 dark:bg-slate-900/80 border border-cyan-200/60 dark:border-cyan-500/20 rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-3xl p-6 sm:p-8 mb-6 sm:mb-8 hover:border-cyan-300/80 dark:hover:border-cyan-500/30 transition-all ${
              isBlocked ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
                <span className="inline-block bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mr-2">
                  Q{currentIndex + 1}.
                </span>
                {q.question}
              </h3>
            </div>

            <div className="space-y-3">
              {q.options.map((o, idx) => (
                <label
                  key={idx}
                  className={`group block p-4 sm:p-5 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 ${
                    selected[q._id] === o
                      ? "border-cyan-600 dark:border-cyan-400 bg-cyan-50/70 dark:bg-cyan-900/30 shadow-lg"
                      : "border-cyan-200/40 dark:border-slate-700/30 bg-white/40 dark:bg-slate-800/20 hover:border-cyan-400/60 dark:hover:border-cyan-400/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      className="w-5 h-5 cursor-pointer accent-cyan-600 dark:accent-cyan-400"
                      type="radio"
                      name={`question_${q._id}`}
                      value={o}
                      checked={selected[q._id] === o}
                      onChange={() => setSelected({ ...selected, [q._id]: o })}
                    />
                    <span
                      className={`text-sm sm:text-base font-medium ${
                        selected[q._id] === o
                          ? "text-cyan-700 dark:text-cyan-300"
                          : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                      }`}
                    >
                      {o}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <button
              disabled={currentIndex === 0 || isBlocked}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="px-6 py-2.5 sm:py-3 backdrop-blur-lg bg-gray-200/70 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              ← Previous
            </button>

            <div className="flex items-center justify-center gap-2 px-4 py-2">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-2 h-2 sm:w-3 sm:h-3 bg-cyan-600 dark:bg-cyan-400"
                      : selected[questions[idx]._id]
                      ? "w-2 h-2 sm:w-2 sm:h-2 bg-green-500 dark:bg-green-400"
                      : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>

            {currentIndex === questions.length - 1 ? (
              <button
                disabled={isBlocked}
                onClick={doSubmit}
                className="px-6 py-2.5 sm:py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                ✓ Submit
              </button>
            ) : (
              <button
                disabled={isBlocked}
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="px-6 py-2.5 sm:py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

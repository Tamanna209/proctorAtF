import { useEffect, useRef } from "react";
import { sendProctorEvent } from "../api/proctor";

export default function useProctorEvents(onSuspiciousActivity) {
  const sessionToken = localStorage.getItem("SESSION_TOKEN");
  const userId = localStorage.getItem("USER_ID");

  const lastVisibilityState = useRef(document.visibilityState);

  // send helper
  const send = async (eventType, details = "") => {
    if (!sessionToken) return;
    try {
      await sendProctorEvent(sessionToken, {
        userId,
        eventType,
        details,
        timestamp: new Date().toISOString(),
      });
      // If callback provided and it's a suspicious event, notify component
      if (
        onSuspiciousActivity &&
        (eventType === "TAB_SWITCH" || eventType === "WINDOW_BLUR")
      ) {
        onSuspiciousActivity(eventType, details);
      }
    } catch (err) {
      // network errors not critical on client
      console.warn("proctor event failed", err?.message || err);
      // if server marks user blocked, redirect immediately
      if (err?.response?.status === 403) {
        // Notify component about blocking
        if (onSuspiciousActivity) {
          onSuspiciousActivity(
            "BLOCKED_BY_SERVER",
            "Server detected suspicious activity"
          );
        }
        window.location.href = "/blocked";
      }
    }
  };

  // request camera+mic; returns boolean
  const ensurePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      // immediately stop tracks to not hold camera
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    // Only set up proctoring listeners if there's a callback (i.e., we're on TestScreen)
    if (!sessionToken || !onSuspiciousActivity) return;

    const handleVisibility = () => {
      const state = document.visibilityState;
      if (state === "hidden" && lastVisibilityState.current !== "hidden") {
        send("TAB_SWITCH", "User switched to another tab");
      }
      lastVisibilityState.current = state;
    };

    // Only listen to visibility changes (tab switches), NOT blur/focus
    // because blur/focus fire on innocent actions like clicking buttons
    window.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [sessionToken, userId, onSuspiciousActivity]); // rebind when these change

  return { ensurePermissions, send };
}

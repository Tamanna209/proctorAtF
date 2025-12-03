// frontend/src/hooks/useAdvancedProctoring.js
import { useEffect, useCallback, useRef } from "react";

export const useAdvancedProctoring = (onSuspiciousActivity) => {
  const suspiciousActivityRef = useRef(false);

  useEffect(() => {
    if (!onSuspiciousActivity) return;

    // 1. FULLSCREEN CHECK - User must be in fullscreen
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity(
            "FULLSCREEN_EXIT",
            "Test window minimized or exited fullscreen"
          );
        }
      }
    };

    // 2. VISIBILITY CHANGE - Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity("TAB_SWITCH", "Switched to another tab");
        }
      }
    };

    // 3. WINDOW BLUR - User left the window (clicked elsewhere)
    const handleWindowBlur = () => {
      if (!suspiciousActivityRef.current) {
        suspiciousActivityRef.current = true;
        onSuspiciousActivity("WINDOW_BLUR", "Clicked away from test window");
      }
    };

    // 4. WINDOW RESIZE - Detect if user tries to minimize or resize
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const handleWindowResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // If window got significantly smaller, it's likely minimized
      if (newWidth < lastWidth * 0.8 || newHeight < lastHeight * 0.8) {
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity(
            "WINDOW_RESIZE",
            "Test window resized or minimized"
          );
        }
      }

      lastWidth = newWidth;
      lastHeight = newHeight;
    };

    // 5. RIGHT CLICK DETECTION - Prevent context menu (inspector tools)
    const handleContextMenu = (e) => {
      e.preventDefault();
      if (!suspiciousActivityRef.current) {
        suspiciousActivityRef.current = true;
        onSuspiciousActivity(
          "RIGHT_CLICK",
          "Attempted to access developer tools"
        );
      }
      return false;
    };

    // 6. KEYBOARD SHORTCUTS - Block F12, Ctrl+Shift+I, etc.
    const handleKeyDown = (e) => {
      // F12 - Developer Tools
      if (e.key === "F12") {
        e.preventDefault();
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity(
            "DEV_TOOLS",
            "Attempted to open developer tools"
          );
        }
        return false;
      }

      // Ctrl/Cmd + Shift + I - Developer Tools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
        e.preventDefault();
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity(
            "DEV_TOOLS",
            "Attempted to open developer tools"
          );
        }
        return false;
      }

      // Ctrl/Cmd + Shift + C - Element Inspector
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity(
            "DEV_TOOLS",
            "Attempted to open element inspector"
          );
        }
        return false;
      }

      // Ctrl/Cmd + Shift + J - Console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "J") {
        e.preventDefault();
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity("DEV_TOOLS", "Attempted to open console");
        }
        return false;
      }

      // Ctrl/Cmd + S - Save page
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return false;
      }

      // Alt + Tab simulation (won't work but we try to detect)
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        if (!suspiciousActivityRef.current) {
          suspiciousActivityRef.current = true;
          onSuspiciousActivity("ALT_TAB", "Attempted to switch applications");
        }
        return false;
      }
    };

    // 7. SCREENSHOT/PRINT PREVENTION
    const handlePrint = (e) => {
      e.preventDefault();
      if (!suspiciousActivityRef.current) {
        suspiciousActivityRef.current = true;
        onSuspiciousActivity(
          "PRINT_ATTEMPT",
          "Attempted to print or take screenshot"
        );
      }
      return false;
    };

    // Attach all listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeprint", handlePrint);

    // Cleanup
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handlePrint);
    };
  }, [onSuspiciousActivity]);

  // Function to request fullscreen
  const requestFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      return true;
    } catch (err) {
      console.error("Fullscreen request failed:", err);
      return false;
    }
  }, []);

  return { requestFullscreen };
};

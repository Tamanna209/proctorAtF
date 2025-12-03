// import { useState, useEffect } from "react";

// /**
//  * Custom hook to watch localStorage for changes
//  * Works across tabs AND within the same tab
//  */
// export function useLocalStorage(key, initialValue = null) {
//   const [storedValue, setStoredValue] = useState(() => {
//     try {
//       const item = window.localStorage.getItem(key);
//       console.log(`[useLocalStorage] Initial read of "${key}":`, item);
//       return item || initialValue;
//     } catch (error) {
//       console.error(`[useLocalStorage] Error reading "${key}":`, error);
//       return initialValue;
//     }
//   });

//   // Listen for changes to this specific localStorage key
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === key || e.key === null) {
//         // e.key is null if localStorage was cleared
//         const newValue = window.localStorage.getItem(key);
//         console.log(
//           `[useLocalStorage] Storage event detected for "${key}":`,
//           newValue
//         );
//         setStoredValue(newValue || initialValue);
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, [key, initialValue]);

//   // Also listen for custom storage events (for same-tab updates)
//   useEffect(() => {
//     const handleCustomStorageChange = (e) => {
//       if (e.detail?.key === key) {
//         console.log(
//           `[useLocalStorage] Custom event detected for "${key}":`,
//           e.detail.value
//         );
//         setStoredValue(e.detail.value || initialValue);
//       }
//     };

//     window.addEventListener("localStorageChange", handleCustomStorageChange);
//     return () =>
//       window.removeEventListener(
//         "localStorageChange",
//         handleCustomStorageChange
//       );
//   }, [key, initialValue]);

//   return storedValue;
// }

// /**
//  * Override localStorage.setItem to dispatch custom events
//  * This allows us to track localStorage changes within the same tab
//  */
// if (typeof window !== "undefined") {
//   const originalSetItem = window.localStorage.setItem;
//   window.localStorage.setItem = function (key, value) {
//     console.log(`[localStorage] Setting "${key}" =`, value);
//     originalSetItem.call(this, key, value);

//     // Dispatch custom event for same-tab subscribers
//     window.dispatchEvent(
//       new CustomEvent("localStorageChange", {
//         detail: { key, value },
//       })
//     );
//   };

//   const originalRemoveItem = window.localStorage.removeItem;
//   window.localStorage.removeItem = function (key) {
//     console.log(`[localStorage] Removing "${key}"`);
//     originalRemoveItem.call(this, key);

//     // Dispatch custom event
//     window.dispatchEvent(
//       new CustomEvent("localStorageChange", {
//         detail: { key, value: null },
//       })
//     );
//   };
// }


import { useState, useEffect } from "react";

/**
 * Simple, stable, iPhone-safe localStorage hook
 * No overriding of setItem/removeItem
 */
export function useLocalStorage(key, initialValue = null) {
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : initialValue;
    } catch (err) {
      console.warn("[useLocalStorage] read error:", err);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // Reload value when key changes
  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  // Listen for cross-tab updates
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key) {
        setStoredValue(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  // Manual setter — use this instead of overriding setItem
  const setValue = (value) => {
    try {
      window.localStorage.setItem(key, value);
      setStoredValue(value);
    } catch (err) {
      console.warn("[useLocalStorage] write error:", err);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(null);
    } catch (err) {
      console.warn("[useLocalStorage] remove error:", err);
    }
  };

  return [storedValue, setValue, removeValue];
}

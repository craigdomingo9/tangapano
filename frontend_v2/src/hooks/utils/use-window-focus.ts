import { useEffect, useState } from "react";

export default function useWindowFocus(delay = 300) {
  const [isFocused, setIsFocused] = useState(() => document.hasFocus());
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleFocus = () => {
      if (timer) clearTimeout(timer);
      setIsFocused(true);
    };

    const handleBlur = () => {
      const t = setTimeout(() => {
        if (!document.hasFocus()) {
          setIsFocused(false);
        }
      }, delay);
      setTimer(t);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        handleBlur();
      } else {
        handleFocus();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (timer) clearTimeout(timer);
    };
  }, [timer, delay]);

  return isFocused;
}

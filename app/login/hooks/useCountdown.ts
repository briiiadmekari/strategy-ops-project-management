import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialSeconds = 0) {
  const [countdown, setCountdown] = useState(initialSeconds);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const start = useCallback((seconds: number) => {
    setCountdown(seconds);
  }, []);

  const reset = useCallback(() => {
    setCountdown(0);
  }, []);

  return { countdown, start, reset };
}

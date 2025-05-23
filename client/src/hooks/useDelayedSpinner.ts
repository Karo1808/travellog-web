import { useState, useEffect, useRef } from "react";

const useDelayedSpinner = (delay = 500) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (spinnerTimerRef.current) {
        clearTimeout(spinnerTimerRef.current);
      }
    };
  }, []);

  const startSpinner = () => {
    spinnerTimerRef.current = window.setTimeout(() => {
      setShowSpinner(true);
    }, delay);
  };

  const stopSpinner = () => {
    if (spinnerTimerRef.current) {
      clearTimeout(spinnerTimerRef.current);
    }
    setShowSpinner(false);
  };

  return { showSpinner, startSpinner, stopSpinner };
};

export default useDelayedSpinner;
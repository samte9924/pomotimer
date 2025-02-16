"use client";

import { useEffect, useRef, useState } from "react";

export const Timer = () => {
  const [seconds, setSeconds] = useState(10);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (intervalRef.current !== null) {
      return; // Prevent multiple timers
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        // Clear interval if seconds reach 0
        if (prev === 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>
        Timer: {Math.floor(seconds / 60)}:
        {(seconds % 60).toString().padStart(2, "0")}
      </p>
      <button onClick={startTimer}>Start</button>
    </div>
  );
};

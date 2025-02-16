"use client";

import { formatTimeToMinutes } from "@/lib/utils";
import { POMODORO_TASKS } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";

export const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState(POMODORO_TASKS[0]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    // Prevent multiple timers
    if (intervalRef.current !== null) {
      return;
    }

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setActiveTask((prev) => {
        // Clear interval and stop timer if it reaches 0
        if (prev.time === 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          changeToNextTask();
          return prev;
        }
        return { ...prev, time: prev.time - 1 };
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const startNextTask = () => {
    const currentIndex = POMODORO_TASKS.findIndex(
      (task) => task.name === activeTask.name
    );
    const nextIndex = (currentIndex + 1) % POMODORO_TASKS.length;
    setActiveTask(POMODORO_TASKS[nextIndex]);
  };

  const savePomoSessionToDB = () => {};

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-8">
      <div className="flex w-full justify-center gap-5">
        {POMODORO_TASKS.map((task, index) => (
          <button
            key={index}
            className={`px-3 py-1 ${
              activeTask.name === task.name && "bg-white"
            }`}
            onClick={() => {
              stopTimer();
              setActiveTask(task);
            }}
          >
            {task.name}
          </button>
        ))}
      </div>
      <span className="text-8xl py-8">
        {formatTimeToMinutes(activeTask.time)}
      </span>
      <div className="flex justify-center gap-10">
        <button
          className="bg-white text-xl px-10 py-4"
          onClick={() => {
            if (isRunning) {
              stopTimer();
            } else {
              startTimer();
            }
          }}
        >
          {isRunning ? "Ferma" : "Avvia"}
        </button>
        {isRunning && (
          <button
            onClick={() => {
              stopTimer();
              savePomoSessionToDB();
              startNextTask();
            }}
          >
            Termina
          </button>
        )}
      </div>
    </div>
  );
};

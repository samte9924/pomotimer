"use client";

import { formatTimeToMinutes } from "@/lib/utils";
import { POMODORO_TASKS } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { revalidatePath } from "next/cache";
import { revalidatePomoSessions } from "@/lib/actions/revalidate";

interface ActiveTask {
  name: string;
  time: number;
  startTime: string;
}

export const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState<ActiveTask>(
    initializeTask(POMODORO_TASKS[0])
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function initializeTask(task: { name: string; time: number }) {
    return {
      ...task,
      startTime: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
  }

  const startTimer = () => {
    // Prevent multiple timers
    if (intervalRef.current !== null) {
      return;
    }

    setIsRunning(true);
    setActiveTask(initializeTask(activeTask));
    let isSessionSaved = false;

    intervalRef.current = setInterval(() => {
      setActiveTask((prev) => {
        // Clear interval and stop timer if it reaches 0
        if (prev.time === 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);

          if (prev.name === POMODORO_TASKS[0].name && !isSessionSaved) {
            isSessionSaved = true;
            savePomoSessionToDB(prev);
          }

          startNextTask();
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

  const endSessionAndSave = () => {
    stopTimer();
    if (activeTask.name === POMODORO_TASKS[0].name) {
      savePomoSessionToDB(activeTask);
    }
  };

  const startNextTask = () => {
    const currentIndex = POMODORO_TASKS.findIndex(
      (task) => task.name === activeTask.name
    );
    const nextIndex = (currentIndex + 1) % POMODORO_TASKS.length;

    setActiveTask(initializeTask(POMODORO_TASKS[nextIndex]));
  };

  const savePomoSessionToDB = async (task: ActiveTask) => {
    const sessionEndTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    console.log(sessionEndTime);

    const session = {
      session_start_time: task.startTime,
      session_end_time: sessionEndTime,
      session_duration: POMODORO_TASKS[0].time - task.time,
    };

    try {
      const res = await fetch("/api/pomo_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });

      if (res.ok) {
        await revalidatePomoSessions();
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              setActiveTask(initializeTask(task));
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
              endSessionAndSave();
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

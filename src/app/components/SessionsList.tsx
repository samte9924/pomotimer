"use client";

import { formatTimeToMinutes } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export interface PomoSession {
  session_id: number;
  task_id: number | null;
  session_start_time: string;
  session_end_time: string;
  session_duration: number;
  cumulative_duration: number;
}

export const SessionsList = ({
  sessionsList,
}: {
  sessionsList: PomoSession[];
}) => {
  if (!sessionsList) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {sessionsList.map((session: PomoSession) => (
        <div key={session.session_id}>
          <p>
            {session.session_start_time.slice(11, 16) + " - "}
            {session.session_end_time.slice(11, 16)}
          </p>
          <p>{formatTimeToMinutes(session.session_duration)}</p>
        </div>
      ))}
    </div>
  );
};

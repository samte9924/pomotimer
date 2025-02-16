"use client";

import { formatTimeToMinutes } from "@/lib/utils";
import { useEffect, useState } from "react";

export const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/pomo_sessions");
        console.log(response);
        const data = await response.json();
        console.log(data.data);
        setSessions(data.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {sessions.map((session) => (
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

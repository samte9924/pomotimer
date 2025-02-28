"use client";

import { useState } from "react";
import { DailyChart } from "../components/DailyChart";
import { WeeklyChart } from "../components/WeeklyChart";
import { MonthlyChart } from "../components/MonthlyChart";

export interface PomoSession {
  session_id: number;
  task_id: number | null;
  session_start_time: string;
  session_end_time: string;
  session_duration: number;
  cumulative_duration: number;
}

export default function ReportPage() {
  const [chartType, setChartType] = useState<"today" | "this_week" | "month">(
    "today"
  );

  return (
    <div className="flex h-full justify-center pt-20">
      <div className="flex flex-col gap-4">
        <button onClick={() => setChartType("today")}>Oggi</button>
        <button onClick={() => setChartType("this_week")}>
          Questa settimana
        </button>
        <button onClick={() => setChartType("month")}>Questo mese</button>
      </div>
      {chartType === "today" && <DailyChart />}
      {chartType === "this_week" && <WeeklyChart />}
      {chartType === "month" && <MonthlyChart />}
    </div>
  );
}

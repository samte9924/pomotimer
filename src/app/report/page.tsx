"use client";

import { useState } from "react";
import { LineChart } from "../components/LineChart";
import { BarChart } from "../components/BarChart";

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
    "this_week"
  );

  return (
    <div className="flex h-full justify-center pt-20">
      <div>
        <button onClick={() => setChartType("today")}>Oggi</button>
        <button onClick={() => setChartType("this_week")}>
          Questa settimana
        </button>
        <button onClick={() => setChartType("month")}>Questo mese</button>
      </div>
      {chartType === "today" ? <LineChart /> : <BarChart />}
    </div>
  );
}

"use client";

import { Chart } from "chart.js";
import { useEffect, useRef, useState } from "react";

interface BarChartData {
  day: string;
  total_duration: number;
  total_sessions: number;
}

const colors = [
  "rgba(255, 87, 51, 0.5)",
  "rgba(51, 255, 87, 0.5)",
  "rgba(51, 87, 255, 0.5)",
  "rgba(255, 51, 168, 0.5)",
  "rgba(255, 195, 0, 0.5)",
];

const borderColors = [
  "rgba(255, 87, 51, 1)",
  "rgba(51, 255, 87, 1)",
  "rgba(51, 87, 255, 1)",
  "rgba(255, 51, 168, 1)",
  "rgba(255, 195, 0, 1)",
];

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const WeeklyChart = ({}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"bar", number[], string> | null>(null);

  const [data, setData] = useState<BarChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/pomo_sessions/this_week`);

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    //console.log("object");
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    console.log("object");

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((item) => item.day.slice(5, 10)),
          datasets: [
            {
              data: data.map((item) => item.total_duration / 60),
              backgroundColor: data.map(
                (_, idx) => colors[idx % colors.length]
              ),
              borderColor: data.map(
                (_, idx) => borderColors[idx % borderColors.length]
              ),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: "Giorno" },
              suggestedMax: 7,
            },
            y: {
              title: { display: true, text: "Tempo di studio (minuti)" },
              ticks: {
                stepSize: 60,
              },
              suggestedMax: 360,
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const totalDuration = data[index].total_duration / 60;
                  const totalSessions = data[index].total_sessions;

                  return [
                    `Tempo totale: ${totalDuration.toFixed(2)} min`,
                    `Sessioni: ${totalSessions}`,
                  ];
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [data]);

  return (
    <div className="w-[85%]">
      {data && data.length > 0 ? (
        <canvas ref={chartRef} />
      ) : (
        <p>Non ci sono sessioni per questa settimana</p>
      )}
    </div>
  );
};

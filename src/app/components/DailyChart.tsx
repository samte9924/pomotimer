"use client";

import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { PomoSession } from "./SessionsList";

function getStudyTimeData(data: PomoSession[]) {
  return data.map((item, index) => ({
    x: String(index + 1),
    y: item.session_duration / 60,
  }));
}

interface ChartData {
  x: string;
  y: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const DailyChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"line", ChartData[], string> | null>(null);

  const [data, setData] = useState<PomoSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/pomo_sessions/today`);

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

    fetchSessions();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Tempo di studio per sessione",
              data: getStudyTimeData(data),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },

        options: {
          responsive: true,
          elements: {
            point: {
              radius: 7,
              hoverRadius: 10,
            },
          },
          scales: {
            x: {
              type: "category",
              title: {
                display: true,
                text: "N° Sessione",
              },
            },
            y: {
              title: {
                display: true,
                text: "Tempo di studio (minuti)",
              },
              ticks: {
                stepSize: 20,
              },
              suggestedMax: 100,
              beginAtZero: true,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-[85%]">
      <canvas ref={chartRef} />
    </div>
  );
};

"use client";

import { Chart } from "chart.js/auto";
import { useCallback, useEffect, useRef } from "react";

function calculateAverage(data: number[]) {
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

interface LineChartProps {
  data: {
    session_id: number;
    task_id: number | null;
    session_start_time: string;
    session_end_time: string;
    session_duration: number;
    cumulative_duration: number;
  }[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"line", number[], string> | null>(null);

  const studyTimeData = data.map((item) => ({
    x: String(item.session_id),
    y: item.session_duration,
  }));

  const avgStudyTime = calculateAverage(
    data.map((item) => item.session_duration)
  );
  const avgStudyTimeData = data.map((item) => ({
    x: String(item.session_id),
    y: avgStudyTime,
  }));

  const buildLineChart = useCallback(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Tempo di studio",
              data: studyTimeData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Media tempo di studio",
              data: avgStudyTimeData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },

        options: {
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
                text: "Sessione",
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [avgStudyTimeData, studyTimeData]);

  useEffect(() => {
    buildLineChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [buildLineChart]);

  return <canvas ref={chartRef} />;
};

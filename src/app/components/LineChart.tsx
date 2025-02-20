"use client";

import { Chart } from "chart.js/auto";
import { useCallback, useEffect, useRef } from "react";
import { PomoSession } from "./SessionsList";

function calculateAverage(data: number[]) {
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

interface LineChartProps {
  data: PomoSession[];
}

interface ChartData {
  x: string;
  y: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"line", ChartData[], string> | null>(null);

  const studyTimeData = data.map((item, index) => ({
    x: String(index + 1),
    y: item.session_duration / 60,
  }));

  const avgStudyTime = calculateAverage(
    data.map((item) => item.session_duration)
  );
  const avgStudyTimeData = data.map((_, index) => ({
    x: String(index + 1),
    y: avgStudyTime / 60,
  }));

  const cumulativeStudyTimeData = data.map((item, index) => ({
    x: String(index + 1),
    y: Number(item.cumulative_duration / 60),
  }));

  const buildLineChart = useCallback(() => {
    if (chartRef.current) {
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
              {
                label: "Tempo di studio cumulativo",
                data: cumulativeStudyTimeData,
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
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
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [avgStudyTimeData, cumulativeStudyTimeData, studyTimeData]);

  useEffect(() => {
    buildLineChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [buildLineChart]);

  return (
    <div className="w-[85%]">
      <canvas ref={chartRef} />
    </div>
  );
};

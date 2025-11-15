"use client";

import React from "react";

interface BarData {
  label: string;
  value: number;
}

interface VisitorBarChartProps {
  data: BarData[];
  loading?: boolean;
  error?: boolean;
}

const VisitorBarChart: React.FC<VisitorBarChartProps> = ({
  data,
  loading = false,
  error = false,
}) => {
  // 최대값 계산 (퍼센트 비율 구하기용)
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full h-40 bg-gray-100 rounded-md flex items-end justify-around px-4 py-3">
      {data.map((item, idx) => {
        const heightPercent =
          loading || error ? 0 : (item.value / maxValue) * 100;

        return (
          <div
            key={idx}
            className="flex flex-col items-center w-1/4"
          >
            {/* 막대 */}
            <div className="relative h-24 w-6 bg-gray-200 rounded-full overflow-hidden flex items-end">
              <div
                className="w-full bg-red-400 rounded-full transition-all duration-500"
                style={{ height: `${heightPercent}%` }}
              />
            </div>

            {/* 라벨 */}
            <div className="mt-1 text-[10px] text-gray-500">{item.label}</div>

            {/* 값 */}
            <div className="mt-0.5 text-[11px] text-gray-700">
              {loading ? "…" : error ? "-" : item.value.toLocaleString("ko-KR")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VisitorBarChart;

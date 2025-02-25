"use client";

import { useState } from "react";
import { Select } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const { Option } = Select;

type YearlyDataType = {
  [key: number]: { name: string; users: number }[];
};

interface UserChartProps {
  data: YearlyDataType;
}

export default function UserChart({ data }: UserChartProps) {
  const latestYear = Math.max(...Object.keys(data).map(Number));
  const [selectedYear, setSelectedYear] = useState<string>(
    latestYear.toString()
  );

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

  const getTotalUsersPerYear = () => {
    return Object.keys(data).map((year) => ({
      name: `${year}`,
      users: data[parseInt(year)].reduce((sum, month) => sum + month.users, 0),
    }));
  };

  const chartData =
    selectedYear === "all"
      ? getTotalUsersPerYear()
      : data[parseInt(selectedYear)];

  const chartConfig = {
    labels: chartData.map((entry) => entry.name),
    datasets: [
      {
        label: "Người dùng",
        data: chartData.map((entry) => entry.users),
        borderColor: "#76d7c4",
        backgroundColor: "rgba(118, 215, 196, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#76d7c4",
      },
    ],
  };

  return (
    <div className="bg-white px-[15px] mt-5 py-[20px] rounded border">
      <div className="flex justify-between mb-5 items-center">
        <h2 className="text-body-bold pb-[10px]">Biểu Đồ Người Dùng</h2>
        <Select
          style={{ width: 160 }}
          value={selectedYear}
          onChange={handleChange}
        >
          <Option value="all">Tất Cả</Option>
          {Object.keys(data)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
        </Select>
      </div>
      <Line data={chartConfig} />
    </div>
  );
}

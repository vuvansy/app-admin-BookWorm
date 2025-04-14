"use client";

import { useState } from "react";
import { Button, Select, Skeleton } from "antd";
import { Line } from "react-chartjs-2";
import useSWR from "swr";
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

interface ApiResponse {
  message: string;
  data: Record<string, number>;
}

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

const UserChart = () => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

  const baseUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/stats/users`;

  const queryParams = new URLSearchParams();
  if (selectedYear) queryParams.append("year", selectedYear.toString());
  if (selectedMonth) queryParams.append("month", selectedMonth.toString());

  const apiUrl = queryParams.toString()
    ? `${baseUrl}?${queryParams.toString()}`
    : baseUrl;

  const { data, error, isLoading } = useSWR<ApiResponse>(apiUrl, fetcher);

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
    setSelectedMonth(undefined);
  };

  const handleMonthChange = (value: number) => {
    if (!selectedYear) return;
    setSelectedMonth(value);
  };

  const handleReset = () => {
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Skeleton active />
      </div>
    );
  }

  if (error || !data?.data) {
    return <p>Lỗi khi tải dữ liệu hoặc dữ liệu không hợp lệ!</p>;
  }
  const getChartTitle = () => {
    if (selectedYear && selectedMonth) {
      if (selectedMonth === 0) {
        return `Biểu đồ người dùng năm ${selectedYear}`;
      }
      return `Biểu đồ người dùng tuần của tháng ${selectedMonth} năm ${selectedYear}`;
    }
    if (selectedYear) {
      return `Biểu đồ người dùng năm ${selectedYear}`;
    }
    return "Biểu đồ người dùng 6 tháng gần đây";
  };
  // ✅ Chuyển object `{ "2024-10": 0, "2025-2": 3 }` thành array `[ { name: "2024-10", users: 0 }, { name: "2025-2", users: 3 } ]`
  const transformedData = Object.entries(data.data).map(([name, users]) => ({
    name,
    users: Number(users),
  }));

  const chartData = {
    labels: transformedData.map((entry) => entry.name),
    datasets: [
      {
        label: "Người dùng",
        data: transformedData.map((entry) => entry.users),
        borderColor: "#76d7c4",
        backgroundColor: "rgba(118, 215, 196, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#76d7c4",
      },
    ],
  };

  const yearOptions = [
    { value: 2024, label: "Năm 2024" },
    { value: 2025, label: "Năm 2025" },
  ];

  const monthOptions = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  return (
    <div className="bg-white px-[15px] mt-5 py-[20px] rounded border">
      <div className="flex justify-between">
        <h2 className="text-body-bold pb-[10px] pr-2">{getChartTitle()}</h2>
        <div className="flex gap-5">
          <Select
            style={{ width: 120 }}
            value={selectedYear}
            placeholder="Chọn Năm"
            onChange={handleYearChange}
            options={yearOptions}
            allowClear
          />
          <Select
            style={{ width: 120 }}
            placeholder="Chọn Tháng"
            value={selectedMonth}
            onChange={handleMonthChange}
            options={monthOptions}
            allowClear
            disabled={!selectedYear}
          />
          <Button type="primary" onClick={handleReset}>
            Đặt Lại
          </Button>
        </div>
      </div>
      <div>
        <Line data={chartData} className="!h-[500px] !w-full" />
      </div>
    </div>
  );
};

export default UserChart;

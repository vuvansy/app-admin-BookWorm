"use client";

import { Button, Select, Skeleton } from "antd";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font = { size: 20 };
defaults.plugins.title.color = "black";

interface OrderStats {
  shipping: number;
  completed: number;
  cancelled: number;
}

const OrderChart = () => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

  const baseUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/stats/orders`;
  const queryParams = new URLSearchParams();
  if (selectedYear) queryParams.append("year", selectedYear.toString());
  if (selectedMonth) queryParams.append("month", selectedMonth.toString());

  const apiUrl = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

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
        <div style={{ padding: 50 }}>
          <Skeleton active />
        </div>
      </div>
    );
  }
  if (error || !data?.data) return <p>Lỗi khi tải dữ liệu!</p>;

  const orderStats: Record<string, OrderStats> = data.data;
  const chartLabels = Object.keys(orderStats);
  const chartData: OrderStats[] = Object.values(orderStats);

  return (
    <div className="w-[49%] bg-white px-[15px] py-[20px] rounded border">
      <div className="flex justify-between">
        <h2 className="text-body-bold pb-[10px]">Biểu Đồ Đơn Hàng 6 Tháng Gần Nhất</h2>
        <div className="flex gap-5">
          <Select
            style={{ width: 120 }}
            value={selectedYear}
            placeholder="Chọn Năm"
            onChange={handleYearChange}
            options={[...Array(10)].map((_, i) => ({
              value: 2020 + i,
              label: `Năm ${2020 + i}`,
            }))}
            allowClear
          />
          <Select
            style={{ width: 120 }}
            placeholder="Chọn Tháng"
            value={selectedMonth}
            onChange={handleMonthChange}
            options={[...Array(12)].map((_, i) => ({
              value: i + 1,
              label: `Tháng ${i + 1}`,
            }))}
            allowClear
            disabled={!selectedYear}
          />
          <Button type="primary" onClick={handleReset}>
            Đặt Lại
          </Button>
        </div>
      </div>
      <Bar
        data={{
          labels: chartLabels,
          datasets: [
            {
              label: "Đơn Hàng Thành Công",
              data: chartData.map((item) => item.completed),
              backgroundColor: "rgba(0, 128, 0, 0.7)",
            },
            {
              label: "Đơn Hàng Bị Hủy",
              data: chartData.map((item) => item.cancelled),
              backgroundColor: "rgba(255, 0, 0, 0.7)",
            },
            {
              label: "Đơn Hàng Đang Giao",
              data: chartData.map((item) => item.shipping),
              backgroundColor: "rgba(0, 0, 255, 0.7)",
            },
          ],
        }}
      />
    </div>
  );
};

export default OrderChart;
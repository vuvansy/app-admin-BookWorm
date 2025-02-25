"use client";

import { Select } from "antd";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font = { size: 20 };
defaults.plugins.title.color = "black";

interface MonthlyOrderDataType {
  month: string;
  success: number;
  canceled: number;
  shipping: number;
}

interface YearlyOrderDataType {
  year: string;
  success: number;
  canceled: number;
  shipping: number;
}

interface DataOrderType {
  year: string;
  monthlyData: MonthlyOrderDataType[];
}

interface OrderChartProps {
  data: DataOrderType[];
}

const OrderChart = ({ data }: OrderChartProps) => {
  const currentYear = new Date().getFullYear().toString();
  const initialYearData = data.find((item) => item.year === currentYear);
  const defaultYear = initialYearData
    ? currentYear
    : data[data.length - 1].year;

  const [selectedYear, setSelectedYear] = useState<string | "Tất cả">(
    defaultYear
  );

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

  const isAllSelected = selectedYear === "Tất cả";

  let chartLabels: string[];
  let chartData: { success: number[]; canceled: number[]; shipping: number[] };

  if (isAllSelected) {
    const yearlyData: YearlyOrderDataType[] = data.map((yearData) => ({
      year: yearData.year,
      success: yearData.monthlyData.reduce(
        (sum, month) => sum + month.success,
        0
      ),
      canceled: yearData.monthlyData.reduce(
        (sum, month) => sum + month.canceled,
        0
      ),
      shipping: yearData.monthlyData.reduce(
        (sum, month) => sum + month.shipping,
        0
      ),
    }));

    chartLabels = yearlyData.map((item) => item.year);
    chartData = {
      success: yearlyData.map((item) => item.success),
      canceled: yearlyData.map((item) => item.canceled),
      shipping: yearlyData.map((item) => item.shipping),
    };
  } else {
    const monthlyData =
      data.find((item) => item.year === selectedYear)?.monthlyData || [];

    chartLabels = monthlyData.map((month) => month.month);
    chartData = {
      success: monthlyData.map((month) => month.success),
      canceled: monthlyData.map((month) => month.canceled),
      shipping: monthlyData.map((month) => month.shipping),
    };
  }

  return (
    <div className="w-[50%] bg-white px-[15px] py-[20px] rounded border">
      <div className="flex justify-between">
        <h2 className="text-body-bold pb-[10px]">Biểu Đồ Đơn Hàng</h2>
        <Select
          showSearch
          style={{ width: 160 }}
          placeholder="Chọn năm"
          value={selectedYear}
          onChange={handleChange}
          options={[
            { value: "Tất cả", label: "Tất cả" },
            ...data
              .slice()
              .sort((a, b) => parseInt(a.year) - parseInt(b.year))
              .map((item) => ({
                value: item.year,
                label: item.year,
              })),
          ]}
        />
      </div>
      <Bar
        data={{
          labels: chartLabels,
          datasets: [
            {
              label: "Đơn Hàng Thành Công",
              data: chartData.success,
              backgroundColor: "rgba(0, 128, 0, 0.7)",
              borderColor: "rgba(0, 128, 0, 1)",
              borderWidth: 1,
            },
            {
              label: "Đơn Hàng Bị Hủy",
              data: chartData.canceled,
              backgroundColor: "rgba(255, 0, 0, 0.7)",
              borderColor: "rgba(255, 0, 0, 1)",
              borderWidth: 1,
            },
            {
              label: "Đơn Hàng Đang Giao",
              data: chartData.shipping,
              backgroundColor: "rgba(0, 0, 255, 0.7)",
              borderColor: "rgba(0, 0, 255, 1)",
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
};

export default OrderChart;

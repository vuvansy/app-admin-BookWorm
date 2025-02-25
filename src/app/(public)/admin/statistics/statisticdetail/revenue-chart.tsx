"use client";

import { Select } from "antd";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font = { size: 20 };
defaults.plugins.title.color = "black";

interface MonthlyDataType {
  month: string;
  value: number;
}
interface DataOrderType {
  year: string;
  monthlyData?: MonthlyDataType[];
  value?: number;
}
interface RevenueChartProps {
  data: DataOrderType[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const [selectedYear, setSelectedYear] = useState("1");

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

  const filteredData =
    selectedYear === "1"
      ? data
          .filter((item) => item.value !== undefined)
          .map((item) => ({ key: item.year, value: item.value as number }))
      : data.find((item) => item.year === selectedYear)?.monthlyData || [];

  return (
    <div className="w-[49%] bg-white px-[15px] py-[20px] rounded border">
      <div className="flex justify-between">
        <h2 className="text-body-bold pb-[10px]">Biểu Đồ Doanh Thu</h2>
        <Select
          showSearch
          style={{ width: 160 }}
          placeholder="Chọn năm"
          defaultValue="1"
          value={selectedYear}
          onChange={handleChange}
          options={[
            { value: "1", label: "Tất Cả" },
            ...data.map((item) => ({
              value: item.year,
              label: item.year,
            })),
          ]}
        />
      </div>
      <Bar
        data={{
          labels: filteredData.map((data) =>
            "key" in data ? data.key : (data as MonthlyDataType).month
          ),
          datasets: [
            {
              label:
                selectedYear === "1"
                  ? "Doanh thu theo năm"
                  : `Doanh thu ${selectedYear}`,
              data: filteredData.map((data) => data.value),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
};

export default RevenueChart;

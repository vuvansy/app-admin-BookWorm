"use client";

import { useState } from "react";
import { Select } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Option } = Select;

type YearlyDataType = {
  [key: number]: { name: string; users: number }[];
};

interface UserChartProps {
  data: YearlyDataType;
}

export default function UserChart({ data }: UserChartProps) {
  const latestYear = Math.max(...Object.keys(data).map(Number));
  const [selectedYear, setSelectedYear] = useState<string>(latestYear.toString());

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

  const getTotalUsersPerYear = () => {
    return Object.keys(data).map((year) => ({
      name: `${year}`,
      users: data[parseInt(year)].reduce((sum, month) => sum + month.users, 0),
    }));
  };

  const chartData = selectedYear === "all" ? getTotalUsersPerYear() : data[parseInt(selectedYear)];

  return (
    <div className="bg-white px-[15px] mt-5 py-[20px] rounded border">
      <div className="flex justify-between mb-5 items-center">
        <h2 className="text-body-bold pb-[10px]">Biểu Đồ Người Dùng</h2>
        <Select style={{ width: 160 }} value={selectedYear} onChange={handleChange}>
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

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="linear" dataKey="users" stroke="#76d7c4" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

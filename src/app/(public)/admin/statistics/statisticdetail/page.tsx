import { Col, Row } from "antd";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaMoneyBills } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { MdAttachMoney } from "react-icons/md";
import RevenueChart from "./revenue-chart";
import OrderChart from "./order-chart";
import UserChart from "./user-chart";
import Overview from "./overview";

const yearlyData = {
  2020: [
    { name: "Tháng 2", users: 50 },
    { name: "Tháng 3", users: 40 },
    { name: "Tháng 5", users: 50 },
    { name: "Tháng 6", users: 30 },
    { name: "Tháng 7", users: 20 },
    { name: "Tháng 9", users: 10 },
    { name: "Tháng 11", users: 60 },
    { name: "Tháng 12", users: 80 },
  ],
  2021: [
    { name: "Tháng 1", users: 10 },
    { name: "Tháng 2", users: 20 },
    { name: "Tháng 3", users: 30 },
    { name: "Tháng 4", users: 60 },
    { name: "Tháng 5", users: 30 },
    { name: "Tháng 6", users: 20 },
    { name: "Tháng 7", users: 60 },
    { name: "Tháng 8", users: 80 },
    { name: "Tháng 9", users: 50 },
    { name: "Tháng 10", users: 70 },
    { name: "Tháng 11", users: 60 },
    { name: "Tháng 12", users: 80 },
  ],
  2022: [
    { name: "Tháng 1", users: 20 },
    { name: "Tháng 2", users: 50 },
    { name: "Tháng 3", users: 40 },
    { name: "Tháng 8", users: 90 },
    { name: "Tháng 9", users: 50 },
    { name: "Tháng 10", users: 70 },
    { name: "Tháng 11", users: 60 },
    { name: "Tháng 12", users: 80 },
  ],
  2023: [
    { name: "Tháng 1", users: 20 },
    { name: "Tháng 2", users: 50 },
    { name: "Tháng 3", users: 40 },
    { name: "Tháng 4", users: 60 },
    { name: "Tháng 5", users: 50 },
    { name: "Tháng 6", users: 70 },
    { name: "Tháng 9", users: 50 },
    { name: "Tháng 10", users: 70 },
    { name: "Tháng 11", users: 60 },
    { name: "Tháng 12", users: 80 },
  ],
  2024: [
    { name: "Tháng 1", users: 10 },
    { name: "Tháng 2", users: 40 },
    { name: "Tháng 3", users: 30 },
    { name: "Tháng 4", users: 40 },
    { name: "Tháng 5", users: 30 },
    { name: "Tháng 6", users: 50 },
    { name: "Tháng 7", users: 40 },
    { name: "Tháng 8", users: 60 },
    { name: "Tháng 9", users: 30 },
    { name: "Tháng 10", users: 50 },
    { name: "Tháng 11", users: 40 },
    { name: "Tháng 12", users: 70 },
  ],
};
const orderData = [
  {
    year: "2021",
    monthlyData: [
      { month: "T1", success: 20, canceled: 5, shipping: 10 },
      { month: "T2", success: 30, canceled: 8, shipping: 15 },
      { month: "T3", success: 50, canceled: 10, shipping: 20 },
      { month: "T4", success: 80, canceled: 12, shipping: 25 },
      { month: "T5", success: 20, canceled: 5, shipping: 10 },
      { month: "T6", success: 30, canceled: 8, shipping: 15 },
      { month: "T7", success: 50, canceled: 10, shipping: 20 },
      { month: "T8", success: 80, canceled: 12, shipping: 25 },
      { month: "T9", success: 20, canceled: 5, shipping: 10 },
      { month: "T10", success: 30, canceled: 8, shipping: 15 },
      { month: "T11", success: 50, canceled: 10, shipping: 20 },
      { month: "T12", success: 80, canceled: 12, shipping: 25 },
    ],
  },
  {
    year: "2022",
    monthlyData: [
      { month: "T1", success: 100, canceled: 20, shipping: 30 },
      { month: "T2", success: 120, canceled: 25, shipping: 40 },
      { month: "T3", success: 150, canceled: 30, shipping: 50 },
      { month: "T4", success: 200, canceled: 35, shipping: 60 },
    ],
  },
  {
    year: "2023",
    monthlyData: [
      { month: "T1", success: 200, canceled: 50, shipping: 70 },
      { month: "T2", success: 300, canceled: 60, shipping: 90 },
      { month: "T3", success: 400, canceled: 70, shipping: 110 },
      { month: "T4", success: 500, canceled: 80, shipping: 130 },
    ],
  },
  {
    year: "2025",
    monthlyData: [
      { month: "T1", success: 500, canceled: 100, shipping: 150 },
      { month: "T2", success: 600, canceled: 120, shipping: 180 },
      { month: "T3", success: 700, canceled: 150, shipping: 210 },
      { month: "T4", success: 800, canceled: 180, shipping: 240 },
    ],
  },
  {
    year: "2024",
    monthlyData: [
      { month: "T1", success: 500, canceled: 100, shipping: 150 },
      { month: "T2", success: 600, canceled: 120, shipping: 180 },
      { month: "T3", success: 700, canceled: 150, shipping: 210 },
      { month: "T4", success: 800, canceled: 180, shipping: 240 },
    ],
  },
];

const revenueData = [
  {
    year: "2021",
    monthlyData: [
      { month: "T1", value: 20000 },
      { month: "T2", value: 30000 },
      { month: "T3", value: 50000 },
      { month: "T4", value: 80000 },
      { month: "T5", value: 20000 },
      { month: "T6", value: 30000 },
      { month: "T7", value: 50000 },
      { month: "T8", value: 80000 },
      { month: "T9", value: 20000 },
      { month: "T10", value: 30000 },
      { month: "T11", value: 50000 },
      { month: "T12", value: 80000 },
    ],
  },
  {
    year: "2022",
    monthlyData: [
      { month: "T1", value: 100000 },
      { month: "T2", value: 120000 },
      { month: "T3", value: 150000 },
      { month: "T4", value: 200000 },
    ],
  },
  {
    year: "2023",
    monthlyData: [
      { month: "T1", value: 200000 },
      { month: "T2", value: 300000 },
      { month: "T3", value: 400000 },
      { month: "T4", value: 500000 },
    ],
  },
  {
    year: "2024",
    monthlyData: [
      { month: "T1", value: 500000 },
      { month: "T2", value: 600000 },
      { month: "T3", value: 700000 },
      { month: "T4", value: 800000 },
    ],
  },
  {
    year: "2025",
    monthlyData: [
      { month: "T1", value: 500000 },
      { month: "T2", value: 600000 },
      { month: "T3", value: 700000 },
      { month: "T4", value: 800000 },
    ],
  },
];

const processedRevenue = revenueData.map((item) => ({
  ...item,
  value: item.monthlyData.reduce((total, month) => total + month.value, 0),
}));

const totalRevenue = processedRevenue.reduce(
  (sum, item) => sum + item.value,
  0
);

const StatisticDetailPage = () => {
  return (
    <div>
      <Overview />
      <div className="flex justify-between gap-x-[10px]">
        <RevenueChart />
        <OrderChart />
      </div>
      <div>
        <UserChart />
      </div>
    </div>
  );
};

export default StatisticDetailPage;

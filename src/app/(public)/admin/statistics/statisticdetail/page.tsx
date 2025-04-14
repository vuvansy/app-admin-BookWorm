import { Col, Row } from "antd";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaMoneyBills } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { MdAttachMoney } from "react-icons/md";
import RevenueChart from "./revenue-chart";
import OrderChart from "./order-chart";
import UserChart from "./user-chart";
import Overview from "./overview";

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

import { Col, Row } from "antd"
import { FaMoneyBills } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { BiSolidMessageDetail } from "react-icons/bi";
import Statistical from "@/components/dashboard/statistical";
import CustomerNew from "@/components/dashboard/customer-new";
import TableOrderWait from "@/components/dashboard/table-order-wait";
import { HiUserGroup } from "react-icons/hi2";

const HomePage = () => {

  return (
    <>
      <div className="mb-5">
        <Row gutter={[20, 20]}>
          <Col span={6}>
            <div className="flex rounded border h-[90px] bg-white">
              <div className="py-[25px] bg-red1 basis-2/6 flex items-center justify-center">
                <FaMoneyBills className="text-white text-[30px] " />
              </div>
              <div className="basis-4/6 flex flex-col py-4 pl-3">
                <h3 className="text-body1 uppercase">Đơn hàng</h3>
                <div className="text-body-bold">10</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="flex rounded border h-[90px] bg-white">
              <div className="py-[25px] bg-[#166B14] basis-2/6 flex items-center justify-center">
                <MdAttachMoney className="text-white text-[30px] " />
              </div>
              <div className="basis-4/6 flex flex-col py-4 pl-3">
                <h3 className="text-body1 uppercase">Tổng doanh thu</h3>
                <div className="text-body-bold">10,999,000</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="flex rounded border h-[90px] bg-white">
              <div className="py-[25px] bg-[#0D63D6] basis-2/6 flex items-center justify-center">
                <HiUserGroup className="text-white text-[30px] " />
              </div>
              <div className="basis-4/6 flex flex-col py-4 pl-3">
                <h3 className="text-body1 uppercase">Tổng người dùng</h3>
                <div className="text-body-bold">1.120</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="flex rounded border h-[90px] bg-white">
              <div className="py-[25px] bg-yellow-1 basis-2/6 flex items-center justify-center">
                <BiSolidMessageDetail className="text-white text-[30px] " />
              </div>
              <div className="basis-4/6 flex flex-col py-4 pl-3">
                <h3 className="text-body1 uppercase">Tổng đánh giá</h3>
                <div className="text-body-bold">10</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <TableOrderWait />
      <div className="flex justify-between gap-x-[15px]">
        <Statistical />
        <CustomerNew />
      </div>
    </>
  )
}

export default HomePage



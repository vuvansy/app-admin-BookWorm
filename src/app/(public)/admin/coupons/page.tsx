import React from "react";
import TableGiftVoucher from "./table-giftvoucher";

const dataGift = [
  {
    stt: 1,
    code: "342343sd",
    discount: 20,
    max_value: 10000,
    min_order: 130000,
    start_date: "2024-03-01",
    end_date: "2024-03-15",
    description: "Giảm 20% - Toàn Sàn",
  },
  {
    stt: 2,
    code: "342344sd",
    discount: 15,
    max_value: 80000,
    min_order: 100000,
    start_date: "2024-03-05",
    end_date: "2024-03-20",
    description: "Giảm 15% - Sản phẩm chọn lọc",
  },
  {
    stt: 3,
    code: "342345sd",
    discount: 25,
    max_value: 12000,
    min_order: 150000,
    start_date: "2024-03-10",
    end_date: "2024-03-25",
    description: "Giảm 25% - Đơn hàng từ 150K",
  },
  {
    stt: 4,
    code: "342346sd",
    discount: 30,
    max_value: 15000,
    min_order: 200000,
    start_date: "2024-03-15",
    end_date: "2024-03-30",
    description: "Giảm 30% - Đơn hàng từ 200K",
  },
];

export default function page() {
  return <TableGiftVoucher data={dataGift} />;
}

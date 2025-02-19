import React from "react";
import TableGift from "./table-gif";
const dataGift = [
  {
    stt: 1,
    code: "342343sd",
    discount: 20,
    start_date: "2024-03-01",
    end_date: "2024-03-15",
  },
  {
    stt: 2,
    code: "342343sd",
    discount: 20,
    start_date: "2024-03-01",
    end_date: "2024-03-15",
  },
  {
    stt: 3,
    code: "342343sd",
    discount: 20,
    start_date: "2024-03-01",
    end_date: "2024-03-15",
  },
  {
    stt: 4,
    code: "342343sd",
    discount: 20,
    start_date: "2024-03-01",
    end_date: "2024-03-15",
  },
];
export default function page() {
  return <TableGift data={dataGift} />;
}

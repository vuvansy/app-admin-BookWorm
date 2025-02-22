"use client";
import React from "react";
import { Table, TableColumnsType } from "antd";
import Link from "next/link";
import Image from "next/image";

interface Product {
  key: string | number;
  image: string;
  name: string;
  quantity: number;
}
interface TableFeedbackProps {
  data: Product[];
}
const columns: TableColumnsType<Product> = [
  {
    title: "Ảnh",
    dataIndex: "image",
    key: "image",
    align: "center",
    render: (src: string) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Image width={80} height={80} src={src} alt="Ảnh sản phẩm" priority />
      </div>
    ),
  },
  {
    title: "Tên Sản Phẩm",
    dataIndex: "name",
    key: "name",
    width: 800,
    className: "whitespace-normal break-words",
  },
  {
    title: "Số Lượng",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
  },
  {
    title: "Thao Tác",
    key: "action",
    render: (record: any) => (
      <div style={{ display: "flex", gap: "10px" }}>
        <Link
          href=""
          className="px-3 py-[6px] bg-[#2F80ED] text-white hover:text-white cursor-pointer rounded-lg "
        >
          Thêm
        </Link>
      </div>
    ),
  },
];

const TableBookWarning: React.FC<TableFeedbackProps> = ({ data }) => {
  const filteredData = data?.filter((item) => item?.quantity <= 5) || [];
  return (
    <div className="bg-white w rounded-lg p-4">
      <p className="mb-5 text-body-bold uppercase">Sản Phẩm Sắp Hết</p>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        
        size="small"
        className="ant-table-striped mt-5"
      />
    </div>
  );
};

export default TableBookWarning;

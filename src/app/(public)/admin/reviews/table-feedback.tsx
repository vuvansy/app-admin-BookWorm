"use client";
import React from "react";
import { Rate, Table, TableColumnsType } from "antd";
import Link from "next/link";
import { BsEyeFill } from "react-icons/bs";
import Image from "next/image";

interface Product {
  key: string | number;
  image: string;
  name: string;
  rating: number;
}

// Định nghĩa kiểu dữ liệu cho props
interface TableFeedbackProps {
  data: Product[];
}
const columns: TableColumnsType<Product> = [
  {
    title: "Ảnh",
    align: "center",
    dataIndex: "image",
    key: "image",
    render: (src: string) => (
      <div className="flex justify-center">
        <Image width={80} height={80} src={src} alt="Ảnh sản phẩm" />
      </div>
    ),
  },
  {
    title: "Tên Sản Phẩm",
    dataIndex: "name",
    key: "name",
    width: 700,
    className: "whitespace-normal break-words",
  },
  {
    title: "Đánh Giá",
    dataIndex: "rating",
    key: "rating",
    render: (rating: number) => (
      <Rate disabled defaultValue={rating} className="!text-[14px]" />
    ),
  },
  {
    title: "Thao Tác",
    key: "action",
    render: (record: any) => (
      <div className="flex gap-[10px]">
        <Link
          href={`/admin/reviews/${record.key}`}
          className="px-3 py-[6px] bg-[#2F80ED] cursor-pointer rounded-lg"
        >
          <BsEyeFill className="text-white text-[16px]" />
        </Link>
      </div>
    ),
  },
];

const TableFeedback: React.FC<TableFeedbackProps> = ({ data }) => {
  return (
    <div className="bg-white w rounded-lg p-4">
      <p className="mb-5 text-body-bold uppercase">Phản Hồi Khách Hàng</p>
      <Table
        columns={columns}
        size="small"
        dataSource={data}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        className="ant-table-striped mt-5"
      />
    </div>
  );
};

export default TableFeedback;

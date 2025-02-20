"use client";
import React from "react";
import { Rate, Table } from "antd";
import Link from "next/link";
import { BsEyeFill } from "react-icons/bs";
import Image from "next/image";

// Định nghĩa kiểu dữ liệu cho props
interface TableFeedbackProps {
  data: any[]; 
}
const columns = [
  {
    title: "Ảnh",
    dataIndex: "image",
    key: "image",
    render: (src: string) => (
      <Image width={50} height={50} src={src} alt="Ảnh sản phẩm" />
    ),
  },
  {
    title: "Tên Sản Phẩm",
    dataIndex: "name",
    key: "name",
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
      <div style={{ display: "flex", gap: "10px" }}>
        <Link
          href={`/admin/reviews/${record.key}`}
          className="p-[7px] bg-[#D84040] cursor-pointer rounded-lg"
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

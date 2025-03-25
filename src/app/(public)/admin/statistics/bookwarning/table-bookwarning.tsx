"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { Button, Table, TableColumnsType } from "antd";
import Image from "next/image";
import UpdateBookWarning from "./update-bookwarning";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TableBookWarning: React.FC = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/books/low-stock`,
    fetcher
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<IBookTable | null>(null);

  const showEditModal = (book: IBookTable) => {
    setEditingBook(book);
    setIsModalVisible(true);
  };

  const hideEditModal = () => {
    setEditingBook(null);
    setIsModalVisible(false);
  };

  if (error) return <p className="text-red-500">Lỗi khi tải dữ liệu!</p>;

  const books: IBookTable[] = Array.isArray(data?.data) ? data.data : [];

  const columns: TableColumnsType<IBookTable> = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (image) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            width={80}
            height={80}
            src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${image}`}
            alt="Ảnh sản phẩm"
            priority
          />
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
      render: (record) => (
        <Button onClick={() => showEditModal(record)} type="primary">
          Thêm
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded p-4">
      <p className="mb-5 text-body-bold uppercase">Sản Phẩm Sắp Hết</p>
      <Table
        columns={columns}
        dataSource={books}
        pagination={{ pageSize: 5 }}
        rowKey="_id"
        size="small"
        className="ant-table-striped mt-5"
        loading={isLoading}
      />
      <UpdateBookWarning
        book={editingBook}
        isVisible={isModalVisible}
        onClose={hideEditModal}
        onSuccess={() => mutate()} 
      />
    </div>
  );
};

export default TableBookWarning;

"use client";
import React, { useState } from "react";
import { Button, Table, TableColumnsType } from "antd";
import Image from "next/image";
import UpdateBookWarning from "./update-bookwarning";

interface TableFeedbackProps {
  data: IBookTable[];
}

const TableBookWarning: React.FC<TableFeedbackProps> = ({ data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<IBookTable | null>(null);
  const [books, setBooks] = useState<IBookTable[]>(data);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/books/low-stock`
      );
      if (!res.ok) {
        throw new Error("Lỗi API: " + res.status);
      }
      const warningData = await res.json();
      const books = Array.isArray(warningData.data) ? warningData.data : [];
      setBooks(books);
    } catch (error) {
      console.error("Lỗi khi tải lại dữ liệu:", error);
    }
  };

  const showEditModal = (book: IBookTable) => {
    setEditingBook(book);
    setIsModalVisible(true);
  };

  const hideEditModal = () => {
    setEditingBook(null);
    setIsModalVisible(false);
  };

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
      />
      <UpdateBookWarning
        book={editingBook}
        isVisible={isModalVisible}
        onClose={hideEditModal}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
};

export default TableBookWarning;

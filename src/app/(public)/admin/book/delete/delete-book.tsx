"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import FilterBook from "../filter-book";
import BookDetail from "../detail-book";
import { sendRequest } from "@/utils/api";
import Link from "next/link";

type BookData = {
  meta: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
  result: IBookTable[];
};

const DeleteBook: React.FC = () => {
  const [books, setBooks] = useState<IBookTable[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBookTable | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    pages: 0,
    total: 0,
  });

  // Lấy danh sách sách đã xóa
  const fetchBookDelete = async () => {
    try {
      const res = await sendRequest<IBackendRes<BookData>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book/deleted`,
        method: "GET",
        queryParams: {
          page: meta.page,
          limit: meta.limit,
          name: searchTerm.trim() || undefined,
        },
      });

      if (res.data?.meta) {
        setBooks(res.data.result);
        setMeta(res.data.meta);
      } else if (res.data) {
        setBooks(res.data as unknown as IBookTable[]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sách:", error);
    }
  };

  useEffect(() => {
    fetchBookDelete();
  }, [meta.page, meta.limit, searchTerm]);

  const handleSearch = (values: any) => {
    //  console.log("Dữ liệu nhận từ FilterBook:", values);
    if (values?.bookName) {
      setSearchTerm(values.bookName);
      setMeta((prev) => ({ ...prev, page: 1 }));
    } else {
      console.warn("Giá trị tìm kiếm bị undefined!");
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const handleUpdateBook = async (book: IBookTable) => {
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book/restore/${book._id}`,
        method: "PATCH",
      });

      message.success("Khôi phục sách thành công!");

      fetchBookDelete();
    } catch (error) {
      console.error("Lỗi khôi phục sách:", error);
    }
  };

  const handleShowDetail = (book: IBookTable) => {
    setSelectedBook(book);
    setDrawerVisible(true);
  };

  const columns: ColumnsType<IBookTable> = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record) => (
        <a
          onClick={() => handleShowDetail(record)}
          className="text-blue-600 cursor-pointer"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Tên Sách",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className="w-[250px] whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </div>
      ),
    },
    {
      title: "Tác Giả",
      dataIndex: "authors",
      render: (authors: IAuthor[] | undefined) => (
        <div className="w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
          {authors?.map((author) => author.name).join(", ") || ""}
        </div>
      ),
    },
    {
      title: "Thể Loại",
      dataIndex: "id_genre",
      render: (genre: IGenre) => (
        <div className="w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
          {genre?.name}
        </div>
      ),
    },
    {
      title: "Nhà Xuất Bản",
      dataIndex: "publishers",
      render: (publishers: string | undefined) => (
        <div className="w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
          {publishers}
        </div>
      ),
    },
    {
      title: "Giá Mới",
      dataIndex: "price_new",
      align: "center",
      render: (price: number) => (
        <span>{Intl.NumberFormat("vi-VN").format(price)} đ</span>
      ),
    },
    {
      title: "Giá Cũ",
      dataIndex: "price_old",
      align: "center",
      render: (price_old?: number) =>
        price_old ? (
          <span>{Intl.NumberFormat("vi-VN").format(price_old)} đ</span>
        ) : null,
    },

    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleUpdateBook(record)}>
          Khôi Phục
        </Button>
      ),
    },
  ];

  return (
    <div className="p-2">
      <div className="bg-white rounded h-[80px] pt-6 px-[15px]">
        <FilterBook onSearch={handleSearch} onReset={handleReset} />
      </div>

      <div className="mt-5 bg-white rounded px-5">
        <div className="flex justify-between items-center h-[60px]">
          <div className="text-body-bold bg-white rounded uppercase py-[14px]">
            Quản lý sách đã xóa
          </div>
          <Link href={"/admin/book"} > <Button type="primary">Quay Lại</Button></Link>
        </div>
        <Table
          columns={columns}
          dataSource={books}
          rowKey="_id"
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            showSizeChanger: true,
            total: meta.total,
            onChange: (page, pageSize) =>
              setMeta((prev) => ({ ...prev, page, limit: pageSize })),
            showTotal: (total, range) => (
              <div>
                {range[0]}-{range[1]} trên {total} rows
              </div>
            ),
          }}
          size="small"
        />
      </div>

      <BookDetail
        book={selectedBook}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
};

export default DeleteBook;

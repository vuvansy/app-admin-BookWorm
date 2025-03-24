"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Tooltip, Popconfirm, Pagination, message } from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import FilterBook from "./filter-book";
import AddBook from "./add-book";
import EditBook from "./edit-book";
import BookDetail from "./detail-book";

import { sendRequest } from "@/utils/api";
import Link from "next/link";
import dynamic from "next/dynamic";
const CSVLinkNoSSR = dynamic(
  () => import("react-csv").then((mod) => mod.CSVLink),
  { ssr: false }
);
// import { CSVLink } from "react-csv";

const csvHeaders = [
  { label: "ID", key: "_id" },
  { label: "Tên Sách", key: "name" },
  { label: "Tác Giả", key: "authors" },
  { label: "Thể Loại", key: "id_genre" },
  { label: "Nhà Xuất Bản", key: "publishers" },
  { label: "Giá Mới", key: "price_new" },
  { label: "Giá Cũ", key: "price_old" },
  {label:  "Mô Tả", key: "description"}
];

function transformDataForCSV(books: IBookTable[]) {
  return books.map((book) => ({
    _id: book._id,
    name: book.name,
    authors: book.authors?.map((author) => author.name).join(", ") || "",
    id_genre: book.id_genre?.name || "",
    publishers: book.publishers || "",
    price_new: book.price_new || 0,
    price_old: book.price_old || 0,
    description: book.description || "",
  }));
}

type BookData = {
  meta: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
  result: IBookTable[];
};
const TableBook: React.FC = () => {
  const [books, setBooks] = useState<IBookTable[]>([]);
  const [exportData, setExportData] = useState<IBookTable[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBookTable | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] =useState<IBookTable | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    pages: 0,
    total: 0,
  });

  const fetchBooks = async () => {
    try {
      const res = await sendRequest<IBackendRes<BookData>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book`,
        method: "GET",
        queryParams: { 
          page: meta.page, 
          limit: meta.limit,
          name: searchTerm.trim() || undefined 
        }, 
      });
  
      // console.log(" API Response:", res);
      if (res.data && res.data.meta) {
        setBooks(res.data.result);
        setExportData(res.data.result);
        setMeta(res.data.meta); 
      } else if (res.data) {
        const data = res.data as unknown as IBookTable[];
        setBooks(data);
        setExportData(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sách:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    // console.log(meta.page);
  }, [meta.page, meta.limit, searchTerm])
  
  const handleSearch = (values: any) => {
    // console.log("Dữ liệu nhận từ FilterBook:", values); 
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
  

  const handleAddBook = (newBook: IBookTable) => {
    fetchBooks();
  };

  const handleEditClick = (book: IBookTable) => {
    setSelectedBookForEdit(book);
    setEditModalVisible(true);
  };

  const handleDeleteBook = async (book: IBookTable) => {
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book/${book._id}`,
        method: "DELETE",
      });

       message.success("Xóa sách thành công!");
      fetchBooks();
    } catch (error) {
      message.error(`Lỗi xóa sách: ${error}`);
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
        <div className="flex justify-center gap-x-5">
          <EditTwoTone
            twoToneColor="#f57800"
            className="cursor-pointer"
            onClick={() => handleEditClick(record)}
          />
          <Popconfirm
            placement="leftTop"
            title="Xác nhận xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            okText="Xác nhận"
            cancelText="Hủy"
            onConfirm={() => handleDeleteBook(record)}
          >
            <span className="cursor-pointer">
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>
        </div>
      ),
    },
  ];
   const csvDataTransformed = transformDataForCSV(exportData);
  return (
    <div className="p-2">
      <div className="bg-white rounded h-[80px] pt-6 px-[15px]">
      <FilterBook onSearch={handleSearch} onReset={handleReset} />
      </div>
      <div className="mt-5 bg-white rounded px-5">
        <div className="flex justify-between items-center h-[60px]">
          <div className="text-body-bold bg-white rounded uppercase py-[14px]">
            Quản lý sách
          </div>
          <div className="flex space-x-2 items-center py-[14px]">
            <Link href={"/admin/book/delete"}>
             <Tooltip title="Danh Sách Sách Ngừng Kinh Doanh">
              <Button
                icon={<DeleteTwoTone twoToneColor="#fff" />}
                type="primary"
              >
                Thùng Rác
              </Button>
            </Tooltip>
            </Link>
            <CSVLinkNoSSR 
              headers={csvHeaders}
              data={csvDataTransformed}
              filename="danh_sach_sach.csv"
               >
              <Button icon={<ExportOutlined />} type="primary">
                Export
              </Button>
            </CSVLinkNoSSR>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setAddModalVisible(true)}
            >
              Thêm Mới
            </Button>
          </div>
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
                {" "}
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
      <AddBook
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddBook}
      />
      {selectedBookForEdit && (
        <EditBook
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          initialBook={selectedBookForEdit}
          onEditSuccess={() => {
            fetchBooks();
          }}
        />
      )}
    </div>
  );
};

export default TableBook;

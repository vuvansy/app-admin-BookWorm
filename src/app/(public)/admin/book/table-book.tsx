"use client";
import React, { useState } from "react";
import { Table, Button, Tooltip, Popconfirm, Drawer, Image } from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import FilterBook from "./filter-book";
import AddBook, { BookForm } from "./add-book";
import EditBook from "./edit-book";
import type { UploadFile, RcFile } from "antd/es/upload";


export interface Book {
  id: string;
  name: string;
  author: string[];
  category: string[];
  quantily: number;
  price: number;
  oldPrice?: number;
  status: string;
  size: string;
  weight: string;
  publishers: string;
  year: string;
  page_count: string;
  book_cover: string;
  des: string;
  created_at: string;
  updated_at: string;
  images: string[];
}

const TableBook: React.FC = () => {

  const [books, setBooks] = useState<Book[]>([
    {
      id: "67af11e06e65f61d9f0e5990",
      name: "Tiệm Sách Của Nàng - Tặng Kèm Bookmark...",
      author: ["Adam Grant", "Ben S. Bernanke"],
      category: ["Nhân Vật - Bài Học Kinh Doanh"],
      quantily: 9,
      price: 80000,
      oldPrice: 100000,
      status: "Đang Hiện",
      size: "4x20x13",
      weight: "555",
      publishers: "Nhà Xuất Bản Kim Đồng",
      year: "12-03-1013",
      page_count: "800",
      book_cover: "Bìa Cứng",
      des: "Sách Đắt Nhân Tâm",
      created_at: "12-1-2024",
      updated_at: "3-2-2025",
      images: [
        "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_41170.jpg",
        "https://cdn0.fahasa.com/media/catalog/product/t/r/truong_ca_achilles_1_2021_12_09_15_24_44.jpg",
      ],
    },
    {
      id: "67af11e06e65f61d9f0e5980",
      name: "Đắc Nhân Tâm (Tái Bản 2021)",
      author: ["Malcolm Gladwell"],
      category: ["Science"],
      quantily: 9,
      price: 90000,
      oldPrice: 120000,
      status: "Đang Hiện",
      size: "4x20x13",
      weight: "555",
      publishers: "Kim Đồng",
      year: "12-03-1013",
      page_count: "800",
      book_cover: "Bìa Cứng",
      des: "Sách Đắt Nhân Tâm",
      created_at: "12-1-2024",
      updated_at: "3-2-2025",
      images: [
        "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_41170.jpg",
        "https://cdn0.fahasa.com/media/catalog/product/t/r/truong_ca_achilles_1_2021_12_09_15_24_44.jpg",
      ],
    },
  ]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  
  const [addModalVisible, setAddModalVisible] = useState(false);
  const handleOpenAddModal = () => setAddModalVisible(true);
  const handleCloseAddModal = () => setAddModalVisible(false);

  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);

 
  const handleShowDetail = (book: Book) => {
    setSelectedBook(book);
    setDrawerVisible(true);
  };

  // Hàm chuyển file sang base64 (dùng cho preview ảnh)
  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  // Handler thêm sách (sử dụng component AddBook)
  const handleAddBook = async (
    formData: BookForm,
    fileLists: { thumbnail?: UploadFile; slider?: UploadFile[] }
  ) => {
    const newBook: Book = {
      id: new Date().getTime().toString(),
      created_at: new Date().toLocaleDateString(),
      updated_at: new Date().toLocaleDateString(),
      images: [],
      ...formData,
    };

    if (fileLists.thumbnail && fileLists.thumbnail.originFileObj) {
      const base64 = await getBase64(fileLists.thumbnail.originFileObj);
      newBook.images.push(base64);
    }
    if (fileLists.slider && fileLists.slider.length > 0) {
      for (let fileObj of fileLists.slider) {
        if (fileObj.originFileObj) {
          const base64 = await getBase64(fileObj.originFileObj);
          newBook.images.push(base64);
        }
      }
    }
    setBooks((prev) => [...prev, newBook]);
    setFilteredBooks((prev) => [...prev, newBook]);
  };


  const handleEditClick = (book: Book) => {
    setSelectedBookForEdit(book);
    setEditModalVisible(true);
  };

  const handleEditBook = async (
    formData: BookForm,
    fileLists: { thumbnail?: UploadFile; slider?: UploadFile[] }
  ) => {
    let updatedThumbnail: string | null = null;
    let updatedSlider: string[] = [];
  
    // Xử lý thumbnail:
    if (fileLists.thumbnail) {
      if (fileLists.thumbnail.originFileObj) {
        // Nếu có file mới được upload thì chuyển đổi sang base64
        updatedThumbnail = await getBase64(fileLists.thumbnail.originFileObj);
      } else if (fileLists.thumbnail.url) {
        // Nếu không thay đổi ảnh, dùng lại ảnh hiện có
        updatedThumbnail = fileLists.thumbnail.url;
      }
    } else {
      updatedThumbnail = selectedBookForEdit?.images[0] || null;
    }
  
    // Xử lý slider:
    if (fileLists.slider && fileLists.slider.length > 0) {
      for (const sliderFile of fileLists.slider) {
        if (sliderFile.originFileObj) {
        
          const sliderBase64 = await getBase64(sliderFile.originFileObj);
          updatedSlider.push(sliderBase64);
        } else if (sliderFile.url) {
          // Nếu không thay đổi, giữ lại ảnh cũ
          updatedSlider.push(sliderFile.url);
        }
      }
    } else {
      
      updatedSlider = selectedBookForEdit ? selectedBookForEdit.images.slice(1) : [];
    }
  
    
    const newImages = updatedThumbnail ? [updatedThumbnail, ...updatedSlider] : selectedBookForEdit?.images || [];
  
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === selectedBookForEdit?.id
          ? {
              ...book,
              ...formData,
              images: newImages,
            }
          : book
      )
    );
    setFilteredBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === selectedBookForEdit?.id
          ? {
              ...book,
              ...formData,
              images: newImages,
            }
          : book
      )
    );
    setEditModalVisible(false);
  };
  
  const columns: ColumnsType<Book> = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record) => (
        <a onClick={() => handleShowDetail(record)} className="text-blue-600 cursor-pointer">
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
      dataIndex: "author",
      render: (authors: string[]) => (
        <div className="w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
          {authors.join(", ")}
        </div>
      ),
    },
    {
      title: "Thể Loại",
      dataIndex: "category",
      render: (categories: string[]) => (
        <div className="w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
          {categories}
        </div>
      ),
    },
    {
      title: "Nhà Xuất Bản",
      dataIndex: "publishers",
      render: (publishers: string) => (
        <div className="w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
          {publishers}
        </div>
      ),
    },
    {
      title: "Giá Mới",
      dataIndex: "price",
      align: "center",
      render: (price: number) => <span>{Intl.NumberFormat("vi-VN").format(price)} đ</span>,
    },
    {
      title: "Giá Cũ",
      dataIndex: "oldPrice",
      align: "center",
      render: (oldPrice?: number) =>
        oldPrice ? <span>{Intl.NumberFormat("vi-VN").format(oldPrice)} đ</span> : null,
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render(_, record) {
        return (
          <div className="flex justify-center gap-x-5">
            <EditTwoTone
              twoToneColor="#f57800"
              className="cursor-pointer"
              onClick={() => handleEditClick(record)}
            />
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa sản phẩm"}
              description={"Bạn có chắc chắn muốn xóa sản phẩm này?"}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span className="cursor-pointer">
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-2">
      {/* Phần Filter */}
      <div className="bg-white rounded h-[80px] pt-6 px-[15px]">
        <FilterBook onSearch={() => {}} onReset={() => {}} />
      </div>

      {/* Bảng danh sách sách */}
      <div className="mt-5 bg-white rounded px-5">
        <div className="flex justify-between items-center h-[60px]">
          <div className="text-body-bold bg-white rounded uppercase py-[14px]">
            Quản lý sách
          </div>
          <div className="flex space-x-2 items-center py-[14px]">
            <Tooltip title="Danh Sách Sách Ngừng Kinh Doanh">
              <Button icon={<DeleteTwoTone twoToneColor="#fff" />} type="primary" >
                Thùng Rác
              </Button>
            </Tooltip>
            <Button icon={<ExportOutlined />} type="primary" >
              Export
            </Button>
            <Button icon={<PlusOutlined />} type="primary"  onClick={handleOpenAddModal}>
              Thêm Mới
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredBooks}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </div>

      {/* Drawer hiển thị chi tiết sách */}
      <Drawer
        title="Chi Tiết Sách"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={"70vw"}
      >
        {selectedBook && (
          <div className="flex flex-wrap rounded">
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10 rounded-tl-lg">
                  ID
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                  {selectedBook.id}
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="w-[30%] flex items-center justify-center bg-bg-main border border-black/10">
                  Tên Sách
                </div>
                <div className="w-[70%] leading-[20px] flex items-center border border-bg-main pl-[15px] py-[5px]">
                  {selectedBook.name}
                </div>
              </div>
            </div>
            {/* Các dòng chi tiết khác của sách */}
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Tác Giả
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                  {selectedBook.author.join(", ")}
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Hình Thức
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                  {selectedBook.book_cover}
                </div>
              </div>
            </div>
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Giá Mới
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                  {Intl.NumberFormat("vi-VN").format(selectedBook.price)} đ
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Giá Cũ
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                  {selectedBook.oldPrice && (
                    <span>{Intl.NumberFormat("vi-VN").format(selectedBook.oldPrice)} đ</span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Thể Loại
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                  {selectedBook.category}
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Số Lượng
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                  {selectedBook.quantily}
                </div>
              </div>
            </div>
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Kích Thước
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                  {selectedBook.size}
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Khối Lượng
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                  {selectedBook.weight} gr
                </div>
              </div>
            </div>
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Số Trang
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                  {selectedBook.page_count}
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Năm Xuất Bản
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                  {selectedBook.year}
                </div>
              </div>
            </div>
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Ngày Tạo
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                  {selectedBook.created_at}
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Ngày Cập Nhật
                </div>
                <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                  {selectedBook.updated_at}
                </div>
              </div>
            </div>
            <div className="w-full flex text-caption">
              <div className="flex-1 flex">
                <div className="w-[15%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                  Mô Tả
                </div>
                <div className="w-[85%] leading-[20px] flex border border-bg-main px-[15px] pt-[10px]">
                  {selectedBook.des}
                </div>
              </div>
            </div>
            <div className="w-full pt-[20px]">
              <p className="text-body1 font-bold">Hình Ảnh</p>
            </div>
            <Image.PreviewGroup>
              <div className="flex gap-2">
                {selectedBook.images.map((img, index) => (
                  <div key={index} className="ml-3 mt-3 w-[100px] h-[100px]">
                    <Image
                      width={100}
                      height={100}
                      src={img}
                      className="rounded-lg border border-[#ccc] w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        )}
      </Drawer>
      {/* Component modal thêm sách */}
      <AddBook visible={addModalVisible} onClose={handleCloseAddModal} onAdd={handleAddBook} />

      {/* Component modal chỉnh sửa sách */}
      {selectedBookForEdit && (
        <EditBook
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onEdit={handleEditBook}
          initialBook={selectedBookForEdit}
        />
      )}
    </div>
  );
};

export default TableBook;

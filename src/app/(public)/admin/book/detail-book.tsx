"use client";
import React from "react";
import { Drawer, Image } from "antd";

interface BookDetailProps {
  book: IBookTable | null;
  visible: boolean;
  onClose: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, visible, onClose }) => {
  return (
    <Drawer
      title="Chi Tiết Sách"
      placement="right"
      onClose={onClose}
      open={visible}
      width="70vw"
    >
      {book && (
        <div className="flex flex-wrap rounded">
          {/* Dòng ID & Tên Sách */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10 ">
                ID
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {book._id}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[30%] flex items-center justify-center bg-bg-main border border-black/10">
                Tên Sách
              </div>
              <div className="w-[70%] leading-[20px] flex items-center border border-bg-main pl-[15px] py-[5px]">
                {book.name}
              </div>
            </div>
          </div>
          {/* Dòng Tác Giả & Hình Thức */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Tác Giả
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {book.authors && book.authors.length > 0
                  ? book.authors.map((author) => author.name).join(", ")
                  : ""}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Hình Thức
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {book.book_cover}
              </div>
            </div>
          </div>
          {/* Dòng Giá Mới & Giá Cũ */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Giá Mới
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {Intl.NumberFormat("vi-VN").format(book.price_new)} đ
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Giá Cũ
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {book.price_old ? (
                  <span>
                    {Intl.NumberFormat("vi-VN").format(book.price_old)} đ
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          {/* Dòng Thể Loại & Số Lượng */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Thể Loại
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {book.id_genre?.name}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Số Lượng
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {book.quantity}
              </div>
            </div>
          </div>
          {/* Dòng Kích Thước & Khối Lượng */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Kích Thước
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {book.size}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Khối Lượng
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {book.weight} gr
              </div>
            </div>
          </div>
          {/* Dòng Số Trang & Năm Xuất Bản */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Số Trang
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {book.page_count}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Năm Xuất Bản
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {book.year}
              </div>
            </div>
          </div>
          {/* Dòng Ngày Tạo & Ngày Cập Nhật */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Ngày Tạo
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {new Date(book.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[30%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Ngày Cập Nhật
              </div>
              <div className="w-[70%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {new Date(book.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          {/* Dòng Mô Tả */}
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[15%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Mô Tả
              </div>
              <div className="w-[85%]  border border-bg-main px-[15px] pt-[10px] description-content " dangerouslySetInnerHTML={{ __html: book.description || "" }}>
                {/* {book.description} */}
              </div>
            </div>
          </div>
          {/* Hình Ảnh */}
          <div className="w-full pt-[20px]">
            <p className="text-body1 font-bold">Hình Ảnh</p>
          </div>
          <Image.PreviewGroup>
            <div className="flex gap-2">
              {[book.image, ...(book.slider ? book.slider : [])].map(
                (img, index) => {
                  const imageUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${img}`;
                  return (
                    <div key={index} className="ml-3 mt-3 w-[100px] h-[100px]">
                      <Image
                        width={100}
                        height={100}
                        src={imageUrl}
                        className="rounded-lg border border-[#ccc] w-full h-full object-contain"
                      />
                    </div>
                  );
                }
              )}
            </div>
          </Image.PreviewGroup>
        </div>
      )}
    </Drawer>
  );
};

export default BookDetail;

"use client";
import React, { useEffect, useState } from "react";
import { Rate, Table, TableColumnsType } from "antd";
import Link from "next/link";
import { BsEyeFill } from "react-icons/bs";
import Image from "next/image";
import { sendRequest } from "@/utils/api";

const columns: TableColumnsType<IReView> = [
  {
    title: "Ảnh",
    align: "center",
    dataIndex: "image",
    key: "image",
    render: (image) => (
      <div className="flex justify-center">
        <div className="relative w-full h-[80px] max-w-[500px]">
          <Image
            unoptimized
            src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${image}`}
            alt=""
            className="object-cover"
            fill
          />
        </div>
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
    dataIndex: "avgRating",
    key: "avgRating",

    render: (avgRating: number) => {
      return (
        <Rate
          disabled
          allowHalf
          defaultValue={avgRating || 0}
          className="!text-[14px]"
        />
      );
    },
  },

  {
    title: "Thao Tác",
    key: "action",
    render: (record: any) => (
      <div className="flex gap-[10px]">
        <Link
          href={`/admin/reviews/${record._id}`}
          className="px-3 py-[6px] bg-[#2F80ED] cursor-pointer rounded-lg"
        >
          <BsEyeFill className="text-white text-[16px]" />
        </Link>
      </div>
    ),
  },
];

const TableFeedback: React.FC = () => {
  const [data, setData] = useState<IReView[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const fetchFeedback = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const res = await sendRequest<{ data: IModelPaginate<IReView> }>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/review/list-book`,
        method: "GET",
        queryParams: { page, limit },
      });
      let books = res.data.result || [];
      const booksWithAvgRating = await Promise.all(
        books.map(async (book) => {
          try {
            const reviewRes = await sendRequest<{
              data: IModelPaginate<IReView>;
            }>({
              url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/review/book/${book._id}`,
              method: "GET",
              queryParams: { page: 1, limit: 100 },
            });

            const reviews = reviewRes.data.result || [];
            const totalRating = reviews.reduce(
              (sum, review) => sum + Number(review.rating),
              0
            );
            const avgRating = reviews.length
              ? parseFloat((totalRating / reviews.length).toFixed(2))
              : 0.0;

            // Tìm đánh giá mới nhất (ưu tiên updatedAt nếu có, nếu không thì lấy createdAt)
            const latestReviewTime = reviews.length
              ? Math.max(
                  ...reviews.map((r) =>
                    new Date(r.updatedAt || r.createdAt || 0).getTime()
                  )
                )
              : 0;

            return { ...book, avgRating, latestReviewTime };
          } catch (error) {
            console.error(
              `Lỗi khi fetch đánh giá cho sách ${book._id}:`,
              error
            );
            return { ...book, avgRating: 0, latestReviewTime: 0 };
          }
        })
      );
      booksWithAvgRating.sort(
        (a, b) => b.latestReviewTime - a.latestReviewTime
      );

      setData(booksWithAvgRating);

      setData(booksWithAvgRating);
      setMeta(res.data.meta || { page: 1, limit: 10, total: 0 });
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(meta.page, meta.limit);
  }, [meta.limit, meta.page]);

  return (
    <div className="bg-white w rounded p-4">
      <p className="mb-5 text-body-bold uppercase">Phản Hồi Khách Hàng</p>
      <Table
        columns={columns}
        size="small"
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => fetchFeedback(page, pageSize),
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} phản hồi`,
        }}
      />
    </div>
  );
};

export default TableFeedback;

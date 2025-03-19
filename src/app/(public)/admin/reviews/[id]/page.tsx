"use client";
import { sendRequest } from "@/utils/api";
import { Button, Rate, Table } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const ReviewPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [data, setData] = useState<IReView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });

  const fetchReviews = useCallback(
    async (page = meta.page, limit = meta.limit) => {
      setLoading(true);
      try {
        const res = await sendRequest<{ data?: IModelPaginate<IReView> }>({
          url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/review/book/${id}`,
          method: "GET",
          queryParams: { page, limit },
        });

        if (!res?.data) {
          throw new Error("API không trả về dữ liệu hợp lệ");
        }

        const sortedData = res.data.result?.sort((a, b) => {
          const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (createdB !== createdA) {
            return createdB - createdA;
          }
          const updatedA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const updatedB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return updatedB - updatedA;
        });

        setData(sortedData || []);
        setMeta(res.data.meta || { page: 1, limit: 10, total: 0 });
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    },
    [id, meta.page, meta.limit]
  );

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id, fetchReviews, meta.page, meta.limit]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!data.length) return <p>Không có đánh giá nào!</p>;

  const columns = [
    {
      title: "Người Đánh Giá",
      dataIndex: "id_user",
      key: "id_user",
      render: (id_user: { fullName: string }) => id_user?.fullName || "Ẩn danh",
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
      title: "Nội Dung",
      dataIndex: "comment",
      key: "comment",
      width: 700,
      className: "whitespace-normal break-words",
    },
  ];

  return (
    <div className="bg-white w-full rounded p-4">
      <p className="mb-5 text-body-bold uppercase">Danh sách đánh giá</p>
      <Table
        dataSource={data}
        rowKey="_id"
        columns={columns}
        size="small"
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setMeta((prev) => ({ ...prev, page, limit: pageSize }));
            fetchReviews(page, pageSize);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} phản hồi`,
        }}
      />
      <Button
        type="primary"
        className="!flex !items-center mt-4"
        onClick={() => router.push("/admin/reviews")}
      >
        Quay Lại
      </Button>
    </div>
  );
};

export default ReviewPage;

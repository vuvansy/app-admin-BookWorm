"use client";
import { Rate, Table } from "antd";
import { useParams } from "next/navigation";

const reviewsData = {
  "1": {
    name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
    reviews: [
      { user: "Võ Văn Khang", rating: 5, content: "Sách hay nên mua để đọc" },
      { user: "Võ Văn Khang", rating: 3, content: "Nội dung ổn" },
      { user: "Võ Văn Khang", rating: 5, content: "Đáng giá tiền" },
      { user: "Võ Văn Khang", rating: 4, content: "Rất hay" },
    ],
  },
  "2": {
    name: "Truyện Tranh ABC",
    reviews: [{ user: "Nguyễn Văn A", rating: 4, content: "Rất hay" }],
  },
};

const ReviewPage = () => {
  const params = useParams();
  const id = params.id as string;

  const product = reviewsData[id as keyof typeof reviewsData] ?? null;

  if (!product) {
    return <p>Không có đánh giá nào !</p>;
  }
  const columns = [
    { title: "Người Đánh Giá", dataIndex: "user", key: "user" },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <Rate disabled defaultValue={rating} className="!text-[14px]" />
      ),
    },
    { title: "Nội Dung", dataIndex: "content", key: "content" },
  ];
  return (
    <div className="bg-white w rounded-lg p-4">
      <p className="mb-5 text-body-bold uppercase">{product.name}</p>
      <Table
        dataSource={product.reviews}
        rowKey={(record) => record.user}
        columns={columns}
      />
    </div>
  );
};

export default ReviewPage;

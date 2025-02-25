"use client";
import { Button, Rate, Table } from "antd";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
const reviewsData = {
  "1": {
    name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
    reviews: [
      {
        id: "r1",
        user: "Võ Văn Khang",
        rating: 5,
        content: "Sách hay nên mua để đọc",
      },
      {
        id: "r2",
        user: "Võ Văn Khang",
        rating: 3,
        content: "Nội dung ổn",
      },
      {
        id: "r3",
        user: "Võ Văn Khang",
        rating: 5,
        content: "Đáng giá tiền",
      },
      {
        id: "r4",
        user: "Võ Văn Khang",
        rating: 4,
        content: "Rất hay",
      },
    ],
  },
  "2": {
    name: "Truyện Tranh ABC",
    reviews: [
      {
        id: "r5",
        user: "Nguyễn Văn A",
        rating: 4,
        content: "Rất hay",
      },
    ],
  },
};

const ReviewPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const product = reviewsData[id as keyof typeof reviewsData] ?? null;

  if (!product) {
    return <p>Không có đánh giá nào !</p>;
  }
  const columns = [
    {
      title: "Người Đánh Giá",
      dataIndex: "user",
      key: "user",
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
      dataIndex: "content",
      key: "content",
      width: 700,
      className: "whitespace-normal break-words",
    },
  ];
  return (
    <div className="bg-white w rounded p-4">
      <p className="mb-5 text-body-bold uppercase">{product.name}</p>
      <Table
        dataSource={product.reviews}
        rowKey={(record) => record.id || record.user}
        columns={columns}
        size="small"
      />
      <Button
        type="primary"
        className="!flex !items-center"
        onClick={() => router.push("/admin/reviews")}
      >
        Quay Lại
      </Button>
    </div>
  );
};

export default ReviewPage;

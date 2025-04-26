"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Table, App, Image as AntImage, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { sendRequest } from "@/utils/api";
import { EditTwoTone, PlusOutlined } from '@ant-design/icons';
import CreatePost from "./add-post"; 
import EditPost from "@/app/(public)/admin/news/edit-post";



type PostData = {
  meta: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
  result: IPost[];
};

const TablePost: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const { message } = App.useApp();
  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    pages: 0,
    total: 0,
  });

  const fetchPosts = useCallback(async () => {
    try {
      const res = await sendRequest<IBackendRes<PostData>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/post`,
        method: "GET",
        queryParams: {
          page: meta.page,
          limit: meta.limit,
        },
      });
      if (res.data?.result) {
        setPosts(res.data.result);
        setMeta(res.data.meta);
      } else {
        message.error("Không tải được danh sách Post.");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi lấy dữ liệu Post.");
    }
  }, [meta.page, meta.limit, message]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const showAddModal = () => setIsAddModalVisible(true);
  const hideAddModal = () => setIsAddModalVisible(false);
  const handleAddPost = useCallback(() => {
    hideAddModal();
    fetchPosts();
  }, [fetchPosts]);
  const showEditModal = (post: IPost) => {
    setSelectedPost(post);
    setIsEditModalVisible(true);
  };
  const hideEditModal = () => {
    setSelectedPost(null);
    setIsEditModalVisible(false);
  };
  const handleEditPost = useCallback((updatedPost: IPost) => {
    hideEditModal();
    fetchPosts();
  }, [fetchPosts])
  const columns: ColumnsType<IPost> = [
    {
      title: "STT",
      key: "_id",
      align: "center",
      render: (_: any, __: IPost, idx: number) =>
        idx + 1 + (meta.page - 1) * meta.limit,
      width: 60,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: 300,
      render: (img: string) => (
        <div className="relative w-full h-[80px]  flex items-center justify-center ">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/post/${img}`}
            alt="Post Image"
            unoptimized
            fill
            priority
            className="object-contain"
          />
        </div>
      ),
    },

    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Mô Tả Ngắn",
      dataIndex: "excerpt",
      key: "excerpt",
      ellipsis: true,
    },
    {
        title: "Trạng Thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 200,
        render: (status: boolean) => {
          const statusData = status
            ? { label: "Hiển Thị", color: "bg-green-500" }
            : { label: "Ẩn", color: "bg-yellow-500" };
          return (
            <span
              className={`${statusData.color} text-white px-2 py-[2px] rounded-md font-medium`}
            >
              {statusData.label}
            </span>
          );
        },
      },
      {
        title: "Thao Tác",
        key: "actions",
        align: "center",
        render: (_: any, record: IPost) => (
          <div className="flex gap-x-[20px] justify-center">
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer" }}
              onClick={() => showEditModal(record)}
            />
            {/* <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa Banner"
              description="Bạn có chắc chắn muốn xóa Banner này?"
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteBanner(record)}
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm> */}
          </div>
        ),
      },
  ];

  return (
    <div className="bg-white rounded-lg px-[15px] pt-4 pb-[10px]">
    <h1 className="text-body-bold uppercase">QUẢN LÝ TIN TIN TỨC</h1>
      <div className="flex justify-end text-[14px] mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
           onClick={showAddModal}
          className="flex items-center"
        >
          Thêm Mới
        </Button>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={posts}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          showSizeChanger: true,
          onChange: (page, pageSize) =>
          setMeta((prev) => ({ ...prev, page, limit: pageSize })),
          showTotal: (total, [from, to]) =>
            `${from}-${to} trên ${total} rows`,
        }}
        size="small"
      />
   <CreatePost
        visible={isAddModalVisible}
        onClose={hideAddModal}
        onAdd={handleAddPost}
      />
      {selectedPost && (
        <EditPost
        visible={isEditModalVisible}
        post={selectedPost}
        onEdit={handleEditPost}
        onClose={hideEditModal}
        />
      )}
    </div>
  );
};

export default TablePost;

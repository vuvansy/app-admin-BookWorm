"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Button, Tooltip, Popconfirm, Pagination, Table, App } from "antd";
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { sendRequest } from "@/utils/api";
import CreateBanner from "./add-banner";
import UpdateBanner from "./edit-banner";



type BannerData = {
  meta: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
  result: IBanner[];
};

const TableBanner: React.FC = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const { message, notification } = App.useApp();
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    pages: 0,
    total: 0,
  });

  const fetchData = async () => {
    try {
      const resBanner = await sendRequest<IBackendRes<BannerData>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/banner`,
        method: "GET",
        queryParams: {
          page: meta.page,
          limit: meta.limit,
        },
      });
      if (resBanner.data?.result) {
        setBanners(resBanner.data.result);
        setMeta(resBanner.data.meta);
      } else {
        message.error("Không tải được danh sách Banner.");
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu banner:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [meta.page, meta.limit]);

  const showAddModal = () => setIsAddModalVisible(true);
  const hideAddModal = () => setIsAddModalVisible(false);


  const showEditModal = (banner: IBanner) => {
    setEditingBanner(banner);
    setIsEditModalVisible(true);
  };
  const hideEditModal = () => {
    setEditingBanner(null);
    setIsEditModalVisible(false);
  };

  const handleAddBanner = useCallback((newBanner: IBanner) => {
    hideAddModal();
    fetchData();
  }, [fetchData]);

  const handleEditBanner = useCallback((updatedBanner: IBanner) => {
    hideEditModal();
    fetchData();
  }, []);

  const handleDeleteBanner = async (banner: IBanner) => {
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/banner/${banner._id}`,
        method: "DELETE",
      });
      message.success("Xóa Banner thành công!");
      fetchData();
    } catch (error) {
      console.error("Lỗi xóa banner:", error);
      message.error("Xóa Banner thất bại!");
    }
  };

  const columns: ColumnsType<IBanner> = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (_: any, record: IBanner, index: number) => {
        return <>{index + 1 + (meta.page - 1) * meta.limit}</>;
      },
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: 500,
      render: (image: string) => (
        <div className="flex justify-center">
          <div className="relative w-full h-[80px] max-w-[500px]">
            <Image
              unoptimized
              src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/banner/${image}`}
              alt="Banner"
              className="object-contain"
              fill
            />
          </div>
        </div>
      ),
    },
    {
      title: "Tên Banner",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 200,
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
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt: Date | undefined) =>
        createdAt ? new Date(createdAt).toLocaleString() : "",
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (_: any, record: IBanner) => (
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
      <h1 className="text-body-bold uppercase">Quản lý Banner</h1>
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
        columns={columns}
        dataSource={banners}
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
      {/* Modal tạo mới Banner */}
      <CreateBanner
        visible={isAddModalVisible}
        onClose={hideAddModal}
        onAdd={handleAddBanner}
      />
      {/* Modal chỉnh sửa Banner */}
      {editingBanner && (
        <UpdateBanner
        visible={isEditModalVisible}
        onClose={hideEditModal}
        onSubmit={handleEditBanner}    
        banner={editingBanner}
        />
      )}
    </div>
  );
};

export default TableBanner;

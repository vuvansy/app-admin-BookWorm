"use client";
import React, { useCallback, useEffect, useState } from "react";
import { App, Button, message, Popconfirm, Space, Switch, Table } from "antd";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { TableProps } from "antd";
import AddGiftVoucherModal from "./add-giftvoucher";
import EditGiftVoucherModal from "./edit-giftvoucher";
import { sendRequest } from "@/utils/api";
import CouponDetail from "./detail-giftvoucher";

const TableGiftVoucher: React.FC = () => {
  const { message, modal, notification } = App.useApp();
  const [coupon, setCoupon] = useState<ICouponTable[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editRecord, setEditRecord] = useState<ICouponTable | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<ICouponTable | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const hideAddModal = () => setIsAddModalOpen(false);

  const fetchCoupon = async (page: number, limit: number) => {
    try {
      console.log(`Fetching coupon data for page: ${page}, limit: ${limit}`);
      const queryParams: Record<string, any> = { page, limit };
      const resCoupon = await sendRequest<{
        data: IModelPaginate<ICouponTable>;
      }>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/coupon`,
        method: "GET",
        queryParams,
      });

      if (resCoupon?.data?.result?.length > 0) {
        console.log("Fetched data:", resCoupon.data.result);
        setCoupon(resCoupon.data.result);
        setMeta({
          page,
          limit,
          total: resCoupon.data.meta.total,
          pages: resCoupon.data.meta.pages,
        });
      } else {
        console.log("No data found.");
        setCoupon([]);
        setMeta({ page, limit, total: 0, pages: 0 });
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchCoupon(meta.page, meta.limit);
  }, [meta.page, meta.limit]);
  //edit
  const handleOpenEditModal = (record: ICouponTable) => {
    console.log("Opening edit modal for record:", record);
    setEditRecord(record);
    setIsEditModalOpen(true);
  };
  const hideEditModal = () => {
    setSelectedCoupon(null);
    setIsEditModalOpen(false);
  };

  const handleEditCoupon = (updatedCoupon: ICouponTable) => {
    setCoupon((prevCoupons) => {
      const filteredCoupons = prevCoupons.filter(
        (coupon) => coupon._id !== updatedCoupon._id
      );
      return [updatedCoupon, ...filteredCoupons];
    });

    hideEditModal();
  };

  //add
  const handleAddCoupon = (newCoupon: ICouponTable) => {
    setCoupon((prevCoupons) => {
      const updatedCoupons = [newCoupon, ...prevCoupons];
      return updatedCoupons;
    });
  };

  const handleToggleCouponStatus = async (
    currentStatus: boolean | string,
    _id: string
  ) => {
    try {
      const newStatus =
        currentStatus === "active" || currentStatus === true ? false : true;

      const apiUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/coupon/status/${_id}`;
      const res = await sendRequest<IBackendRes<ICouponTable>>({
        url: apiUrl,
        method: "PATCH",
        body: { status: newStatus },
      });

      if (res?.data) {
        const updatedStatus = newStatus ? "active" : "inactive";
        if (updatedStatus === "active") {
          message.success(
            res.message || "Coupon đã được kích hoạt thành công!"
          );
        } else {
          message.error(res.message || "Coupon đã bị vô hiệu hóa!");
        }
        setCoupon((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon._id.toString() === _id
              ? { ...coupon, status: newStatus ? "active" : "inactive" }
              : coupon
          )
        );
      } else {
        message.error(res?.message || "Cập nhật trạng thái thất bại");
        fetchCoupon(meta.page, meta.limit);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái coupon:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái coupon");
      fetchCoupon(meta.page, meta.limit);
    }
  };
  //delete
  const handleDeleteCoupon = async (coupon: ICouponTable) => {
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/coupon/${coupon._id}`,
        method: "DELETE",
      });
      fetchCoupon(meta.page, meta.limit);
    } catch (error) {
      console.error("Lỗi xóa coupon:", error);
    }
  };
  //detail
  const handleShowDetail = (coupon: ICouponTable) => {
    setSelectedCoupon(coupon);
    setDrawerVisible(true);
  };
  const columns: TableProps<ICouponTable>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
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
      title: "Mã Giảm Giá",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (value: string) => <>#{value}</>,
    },
    {
      title: "Giảm Giá",
      dataIndex: "value",
      key: "value",
      align: "center",
      render: (value: number) => <>{value}%</>,
    },
    {
      title: "Giá Giảm Tối Đa",
      align: "center",
      dataIndex: "max_value",
      key: "max_value",
      render: (value: number | undefined) =>
        value !== undefined ? `${value.toLocaleString()} đ` : "N/A",
    },
    {
      title: "Đơn Hàng Tối Thiểu",
      align: "center",
      dataIndex: "min_total",
      key: "min_total",
      render: (value: number | undefined) =>
        value !== undefined ? `${value.toLocaleString()} đ` : "N/A",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "start_date",
      key: "start_date",
      align: "center",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Trạng Thái",

      dataIndex: "status",
      render: (status: boolean | string, record) => (
        <Popconfirm
          placement="topRight"
          title={`${status === "inactive" ? "Mở" : "khóa"} Coupon`}
          description={`Bạn có chắc chắn muốn ${
            status === "inactive" ? "mở" : "khóa"
          } Coupon ${record.code}?`}
          onConfirm={() =>
            handleToggleCouponStatus(status, record._id.toString())
          }
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Switch checked={status === "active"} />
        </Popconfirm>
      ),
    },
    {
      title: "Thao Tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EditTwoTone
            twoToneColor={"#f57800"}
            onClick={() => handleOpenEditModal(record)}
            className="px-[10px]"
          />
          {/* <Popconfirm
            placement="topLeft"
            title="Xóa mã giảm giá"
            description="Bạn có chắc muốn xóa mã giảm giá này không?"
            okText="Xác nhận"
            cancelText="Hủy"
            onConfirm={() => handleDeleteCoupon(record)}
          >
            <DeleteTwoTone twoToneColor={"#ff4d4f"} />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white w rounded p-4">
        <h2 className="text-body-bold uppercase">Quản Lý Mã Giảm Giá</h2>
        <div className="flex justify-end pb-5">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Thêm mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={coupon}
          rowKey="_id"
          size="small"
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
        />
      </div>
      <CouponDetail
        coupon={selectedCoupon ?? undefined}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
      <AddGiftVoucherModal
        isAddModalOpen={isAddModalOpen}
        onClose={hideAddModal}
        onAdd={handleAddCoupon}
      />
      {isEditModalOpen && (
        <EditGiftVoucherModal
          visible={isEditModalOpen}
          onClose={hideEditModal}
          onSubmit={handleEditCoupon}
          coupon={editRecord}
        />
      )}
    </div>
  );
};

export default TableGiftVoucher;

"use client";
import React, { useState } from "react";
import { Button, message, Popconfirm, Space, Table } from "antd";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { PopconfirmProps, TableProps } from "antd";
import AddGiftVoucherModal from "./add-giftvoucher";
import EditGiftVoucherModal from "./edit-giftvoucher";

interface DataType {
  stt: number;
  code: string;
  discount: number;
  max_value: number;
  min_order: number;
  start_date: string;
  end_date: string;
  description: string;
}

interface TableGiftProps {
  data: DataType[];
}

const confirm: PopconfirmProps["onConfirm"] = (e) => {
  console.log(e);
  message.success("Click on Yes");
};

const cancel: PopconfirmProps["onCancel"] = (e) => {
  console.log(e);
  message.error("Click on No");
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
};
const TableGiftVoucher: React.FC<TableGiftProps> = ({ data }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<DataType | null>(null);

  const handleOpenEditModal = (record: DataType) => {
    setEditRecord(record);
    setIsEditModalOpen(true);
  };

  const columns: TableProps<DataType>["columns"] = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    {
      title: "Mã Giảm Giá",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (value: string) => <>#{value}</>,
    },
    {
      title: "Giảm Giá",
      dataIndex: "discount",
      key: "discount",
      align: "center",
      render: (value: number) => <>{value}%</>,
    },
    {
      title: "Giá Trị Tối Đa",
      align: "center",
      dataIndex: "max_value",
      key: "max_value",
      render: (value: number) => <>{formatCurrency(value)}</>,
    },
    {
      title: "Đơn Hàng Tối Thiểu",
      align: "center",
      dataIndex: "min_order",
      key: "min_order",
      render: (value: number) => <>{formatCurrency(value)}</>,
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
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thao Tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {
            <EditTwoTone
              twoToneColor={"#f57800"}
              onClick={() => handleOpenEditModal(record)}
              className="px-[10px]"
            />
          }

          <Popconfirm
            placement="leftTop"
            title="Delete the task"
            description="Bạn có chắc chắn muốn xóa người dùng này không?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <span className="cursor-pointer">
              {<DeleteTwoTone twoToneColor={"#ff4d4f"} />}
            </span>
          </Popconfirm>
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
          dataSource={data}
          rowKey="stt"
          className="ant-table-striped"
          size="small"
        />
      </div>
      <AddGiftVoucherModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />
      <EditGiftVoucherModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        record={editRecord}
        onSubmit={(values) => {
          console.log("Dữ liệu sau khi chỉnh sửa:", values);
        }}
      />
    </div>
  );
};

export default TableGiftVoucher;

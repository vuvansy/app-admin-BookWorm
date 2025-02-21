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
  start_date: string;
  end_date: string;
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
const TableGiftVoucher: React.FC<TableGiftProps> = ({ data }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<DataType | null>(null);

  const handleAddVoucher = (values: any) => {
    console.log("Dữ liệu thêm mới:", values);
    setIsAddModalOpen(false);
  };

  const handleEditVoucher = (values: any) => {
    console.log("Dữ liệu chỉnh sửa:", values);
    setIsEditModalOpen(false);
  };

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
      render: (value: string) => <>#{value}</>,
    },
    {
      title: "Giảm Giá",
      dataIndex: "discount",
      key: "discount",
      render: (value: number) => <>{value}%</>,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Thao Tác",
      key: "action",
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
      <div className="bg-white w rounded-lg p-4">
        <p className="mb-5 text-body-bold uppercase">Quản Lý Mã Giảm Giá</p>
        <Button
          type="primary"
          className=" !flex !items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          Thêm Mã <PlusOutlined />
        </Button>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="stt"
          className="ant-table-striped mt-5"
          size="small"
        />
      </div>
      <AddGiftVoucherModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddVoucher}
      />
      <EditGiftVoucherModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditVoucher}
        record={editRecord}
      />
    </div>
  );
};

export default TableGiftVoucher;

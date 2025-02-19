"use client";
import React, { useState } from "react";
import { Button, Form, Input, Modal, Space, Table, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";

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

const TableGift: React.FC<TableGiftProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm(); //
  const [editForm] = Form.useForm();

  const [editRecord, setEditRecord] = useState<DataType | null>(null);

  // Mở modal thêm mới
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Đóng modal thêm mới
  const handleCloseModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  // Xử lý thêm mới mã giảm giá
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          start_date: values.start_date.format("YYYY-MM-DD"),
          end_date: values.end_date.format("YYYY-MM-DD"),
        };
        console.log("Dữ liệu đã nhập:", formattedValues);
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.log("Lỗi:", errorInfo);
      });
  };

  // Mở modal chỉnh sửa và điền dữ liệu vào form
  const handleOpenEditModal = (record: DataType) => {
    setEditRecord(record);
    editForm.setFieldsValue({
      ...record,
      start_date: dayjs(record.start_date),
      end_date: dayjs(record.end_date),
    });
    setIsEditModalOpen(true);
  };

  // Đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    editForm.resetFields();
    setIsEditModalOpen(false);
  };

  // Xử lý lưu chỉnh sửa
  const handleEditOk = () => {
    editForm
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          start_date: values.start_date.format("YYYY-MM-DD"),
          end_date: values.end_date.format("YYYY-MM-DD"),
        };
        console.log("Dữ liệu chỉnh sửa:", formattedValues);
        setIsEditModalOpen(false);
        editForm.resetFields();
      })
      .catch((errorInfo) => {
        console.log("Lỗi:", errorInfo);
      });
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
          <MdOutlineEdit
            className="text-[#F6A500] text-[18px] cursor-pointer"
            onClick={() => handleOpenEditModal(record)}
          />
          <RiDeleteBin6Line className="text-[#C92127] text-[18px] cursor-pointer" />
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="bg-white w rounded-lg p-4">
        <p className="mb-5 text-sub-heading-bold">Quản Lý Mã Giảm Giá</p>

        <Button
          type="primary"
          className="!h-[40px] !rounded-lg !text-body1 !py-0 !px-[16px] !flex !items-center"
          onClick={handleOpenModal}
        >
          Thêm Mã
          <PlusOutlined className="text-[16px]" />
        </Button>

        <Table<DataType>
          columns={columns}
          dataSource={data}
          rowKey="stt"
          className="ant-table-striped mt-5"
        />
      </div>

      {/* Modal Thêm Mới */}
      <Modal
        title="Thêm mới mã giảm giá"
        open={isModalOpen}
        onCancel={handleCloseModal}
        destroyOnClose={true}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Tạo mới
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã Giảm"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phần trăm giảm %"
            name="discount"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu" }]}
          >
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc" }]}
          >
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chỉnh Sửa */}
      <Modal
        title="Chỉnh sửa mã giảm giá"
        open={isEditModalOpen}
        onCancel={handleCloseEditModal}
        destroyOnClose={true}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={handleCloseEditModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditOk}>
            Lưu chỉnh sửa
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Mã Giảm"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phần trăm giảm %"
            name="discount"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu" name="start_date">
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
          <Form.Item label="Ngày kết thúc" name="end_date">
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableGift;

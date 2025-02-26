import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Divider,
  FormProps,
} from "antd";
import dayjs from "dayjs";
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

interface IProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (v: boolean) => void;
}

const AddGiftVoucherModal = (props: IProps) => {
  const { isAddModalOpen, setIsAddModalOpen } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<DataType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    console.log(values);
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm Mới Mã Giảm Giá"
      open={isAddModalOpen}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        form.resetFields();
        setIsAddModalOpen(false);
      }}
      okText={"Tạo mới"}
      cancelText={"Hủy"}
      width={"40vw"}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Divider />
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="flex gap-5">
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Mã Giảm"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Phần trăm giảm %"
            name="discount"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </div>
        <div className="flex gap-5">
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Giá Trị Tối Đa"
            name="max_value"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị tối đa" },
            ]}
          >
            <Input
              type="number"
              suffix={
                <span className="bg-gray-200 px-3 py-1 rounded-r-md text-black font-medium flex items-center">
                  đ
                </span>
              }
              className="text-right !pr-0 !py-0"
            />
          </Form.Item>
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Đơn Hàng Tối Thiểu"
            name="min_order"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập đơn hàng tối thiểu",
              },
            ]}
          >
            <Input
              type="number"
              suffix={
                <span className="bg-gray-200 px-3 py-1 rounded-r-md text-black font-medium flex items-center">
                  đ
                </span>
              }
              className="text-right !pr-0 !py-0"
            />
          </Form.Item>
        </div>
        <div className="flex gap-5">
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu" }]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              className="w-full "
              value={dayjs()}
            />
          </Form.Item>
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc" }]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              className="w-full"
              value={dayjs()}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Mô Tả Mã Giảm Giá"
          name="description"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả mã giảm giá",
            },
          ]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddGiftVoucherModal;

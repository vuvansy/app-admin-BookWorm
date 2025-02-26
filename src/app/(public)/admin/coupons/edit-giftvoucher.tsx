import React, { useEffect, useState } from "react";
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
  start_date: string | null;
  end_date: string | null;
  description: string;
}

interface IProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (v: boolean) => void;
  record: DataType | null;
  onSubmit: (data: DataType) => void;
}

const EditGiftVoucherModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  record,
  onSubmit,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<DataType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const formattedValues = {
      ...values,
      start_date: values.start_date
        ? dayjs(values.start_date).format("YYYY-MM-DD")
        : null,
      end_date: values.end_date
        ? dayjs(values.end_date).format("YYYY-MM-DD")
        : null,
    };
    onSubmit(formattedValues);
    setIsSubmit(false);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        start_date: record.start_date ? dayjs(record.start_date) : null,
        end_date: record.end_date ? dayjs(record.end_date) : null,
      });
    }
  }, [record, form]);

  return (
    <Modal
      title="Chỉnh Sửa Mã Giảm Giá"
      open={isEditModalOpen}
      onCancel={() => setIsEditModalOpen(false)}
      destroyOnClose={true}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmit}
          onClick={() => form.submit()}
        >
          Lưu chỉnh sửa
        </Button>,
      ]}
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
            <Input type="number" suffix="đ" className="text-right" />
          </Form.Item>
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Đơn Hàng Tối Thiểu"
            name="min_order"
            rules={[
              { required: true, message: "Vui lòng nhập đơn hàng tối thiểu" },
            ]}
          >
            <Input type="number" suffix="đ" className="text-right" />
          </Form.Item>
        </div>
        <div className="flex gap-5">
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu" }]}
          >
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc" }]}
          >
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
        </div>
        <Form.Item
          label="Mô Tả Mã Giảm Giá"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả mã giảm giá" },
          ]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGiftVoucherModal;

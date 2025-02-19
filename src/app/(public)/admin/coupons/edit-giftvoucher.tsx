import React, { useEffect } from "react";
import { Modal, Form, Input, Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { DataType } from "./type";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  record: DataType | null;
}

const EditGiftVoucherModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  record,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        start_date: dayjs(record.start_date),
        end_date: dayjs(record.end_date),
      });
    }
  }, [record, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          start_date: values.start_date.format("YYYY-MM-DD"),
          end_date: values.end_date.format("YYYY-MM-DD"),
        };
        onSubmit(formattedValues);
        form.resetFields();
      })
      .catch((errorInfo) => console.log("Lỗi:", errorInfo));
  };

  return (
    <Modal
      title="Chỉnh sửa mã giảm giá"
      open={open}
      onCancel={onClose}
      destroyOnClose={true}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Lưu chỉnh sửa
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
        <Form.Item label="Ngày bắt đầu" name="start_date">
          <DatePicker format="DD-MM-YYYY" className="w-full" />
        </Form.Item>
        <Form.Item label="Ngày kết thúc" name="end_date">
          <DatePicker format="DD-MM-YYYY" className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGiftVoucherModal;

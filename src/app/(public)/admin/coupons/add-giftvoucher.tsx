import React from "react";
import { Modal, Form, Input, Button, DatePicker } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const AddGiftVoucherModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();

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
      title="Thêm mới mã giảm giá"
      open={open}
      onCancel={onClose}
      destroyOnClose={true}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onClose}>
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
  );
};

export default AddGiftVoucherModal;

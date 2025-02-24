import React, { useEffect, useRef } from "react";
import { Modal, Form, Input, Button ,InputRef } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const AddGenre: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const inputRef = useRef<InputRef | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => addButtonRef.current?.focus(), 100);
    }
  }, [visible]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values.name);
      form.resetFields();
    });
  };

  return (
    <>
      <Button ref={addButtonRef} style={{ display: "none" }} />
      <Modal
        title="Thêm Thể Loại Mới"
        open={visible}
        onCancel={onClose}
        onOk={handleOk}
        okText="Tạo Mới"
        cancelText="Hủy"
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
           
            rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
          >
            <Input ref={inputRef} placeholder="Nhập tên thể loại" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddGenre;

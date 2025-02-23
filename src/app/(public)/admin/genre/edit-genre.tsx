import React, { useEffect, useRef } from "react";
import { Modal, Form, Input, Button,InputRef } from "antd";

interface EditGenreProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (id: number, name: string) => void;
  genre: { id: number; name: string } | null;
}

const EditGenre: React.FC<EditGenreProps> = ({ visible, onClose, onSubmit, genre }) => {
  const [form] = Form.useForm();
  const inputRef = useRef<InputRef | null>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible && genre) {
      form.setFieldsValue({ name: genre.name });
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => editButtonRef.current?.focus(), 100);
    }
  }, [visible, genre]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (genre) {
        onSubmit(genre.id, values.name);
      }
      form.resetFields();
    });
  };

  return (
    <>
      <Button ref={editButtonRef} style={{ display: "none" }} />
      <Modal
        title="Chỉnh Sửa Thể Loại"
        open={visible}
        onCancel={onClose}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
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

export default EditGenre;

"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";

const FilterBook: React.FC<{
  onSearch: (values: any) => void;
  onReset: () => void;
}> = ({ onSearch, onReset }) => {
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Form
      form={form}
      layout="horizontal"
      onFinish={(values) => {
        const trimmedValues = {
          ...values,
          bookName: values.bookName?.trim() || "",
        };
        onSearch(trimmedValues);
      }}
      initialValues={{ bookName: "" }}
    >
      <div className="flex justify-between gap-x-4">
        <div className="basis-2/3 flex gap-x-[100px]">
          <Form.Item
            name="bookName"
            label="Tên Sách"
            className="flex-1 text-body1"
          >
            <Input
              placeholder="Vui lòng nhập"
              className="w-[300px]"
              onPressEnter={() => form.submit()}
            />
          </Form.Item>
        </div>

        <div className="basis-1/3 flex justify-end gap-x-[15px]">
          <Button
            onClick={() => {
              form.resetFields();
              onReset();
            }}
            className="border border-gray-300"
          >
            Tải Lại
          </Button>
          <Button
            type="primary"
            htmlType="submit" // Đúng cách để kích hoạt `onFinish`
            className="bg-blue-500"
          >
            Tìm Kiếm
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default FilterBook;

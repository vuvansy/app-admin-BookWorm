import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Divider,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";

interface EditCoupon {
  visible: boolean;
  onClose: () => void;
  onSubmit: (updatedCoupon: ICouponTable) => void;
  coupon: ICouponTable | null;
}
const EditGiftVoucherModal: React.FC<EditCoupon> = ({
  visible,
  onClose,
  onSubmit,
  coupon,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (coupon) {
      form.setFieldsValue({
        ...coupon,
        start_date: coupon.start_date ? dayjs(coupon.start_date) : null,
        end_date: coupon.end_date ? dayjs(coupon.end_date) : null,
      });
    }
  }, [coupon, form]);

  const handleOk = async () => {
    try {
      setIsSubmit(true);
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        start_date: values.start_date ? values.start_date.toISOString() : null,
        end_date: values.end_date ? values.end_date.toISOString() : null,
      };

      if (coupon) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/coupon/${coupon._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedValues),
          }
        );
        const updatedCoupon = await response.json();
        if (updatedCoupon.data) {
          message.success("Cập nhật coupon thành công.");
          onSubmit(updatedCoupon.data); 
          onClose();
        } else {
          message.error(updatedCoupon.message);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Chỉnh Sửa Mã Giảm Giá"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
      style={{ top: 20 }}
    >
      <Divider />
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "active",
        }}
      >
        <div className="flex gap-5">
          <Form.Item className="basis-1/2 !mb-5" label="Mã Giảm" name="code">
            <Input />
          </Form.Item>
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Phần trăm giảm %"
            name="value"
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
            label="Số Lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item<IBookTable>
            name="status"
            label="Trạng Thái"
            className="basis-1/2"
            rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
          >
            <Select
              options={[
                { value: "active", label: "Đang Hoạt Động" },
                { value: "inactive", label: "Chưa Kích Hoạt" },
              ]}
            />
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
            name="min_total"
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

export default EditGiftVoucherModal;

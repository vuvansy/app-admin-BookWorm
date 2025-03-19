import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Divider,
  Select,
  message,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { sendRequest } from "@/utils/api";

interface AddCouponProps {
  isAddModalOpen: boolean;
  onClose: () => void;
  onAdd: (newCoupon: ICouponTable) => void;
}
const AddGiftVoucherModal: React.FC<AddCouponProps> = ({
  isAddModalOpen,
  onAdd,
  onClose,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const thumbnailList = values.thumbnail;
      let thumbnailUrl = "";

      if (Array.isArray(thumbnailList) && thumbnailList.length > 0) {
        thumbnailUrl = thumbnailList[0]?.url || "";
      }

      delete values.thumbnail;

      const payload = {
        ...values,
      };

      const res = await sendRequest<IBackendRes<ICouponTable>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/coupon`,
        method: "POST",
        body: payload,
      });

      if (
        res.statusCode === 200 ||
        res.statusCode === 201 ||
        res.statusCode === "200" ||
        res.statusCode === "201"
      ) {
        if (res.data) {
          message.success("Tạo CouPon thành công!");
          onAdd(res.data);
        }
      } else {
        message.error(res.message || "Tạo CouPon thất bại!");
        return;
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error creating genre:", error);
      message.error("Tạo danh mục thất bại!");
    }
  };
  return (
    <Modal
      title="Thêm Mới Mã Giảm Giá"
      open={isAddModalOpen}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText={"Tạo mới"}
      cancelText={"Hủy"}
      width={"60vw"}
      destroyOnClose={true}
      maskClosable={false}
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
            label="Phần Trăm Giảm "
            name="value"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter=" %"
            />
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
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter=" đ"
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
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter=" đ"
            />
          </Form.Item>
        </div>
        <div className="flex gap-5">
          <Form.Item
            className="basis-1/2 !mb-5"
            label="Ngày Bắt Đầu"
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
            label="Ngày Kết Thúc"
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

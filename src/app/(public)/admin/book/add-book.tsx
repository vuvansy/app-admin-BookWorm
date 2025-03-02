"use client";
import React, { useState } from "react";
import {Modal,Form,Input,InputNumber,Select,Upload,Image,App,Divider,} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { UploadChangeParam } from "antd/es/upload";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";

export interface BookForm {
  name: string;
  author: string[];
  category: string[];
  quantily: number;
  price: number;
  oldPrice?: number;
  status: string;
  size: string;
  weight: string;
  publishers: string;
  year: string;
  page_count: string;
  book_cover: string;
  des: string;
}

interface AddBookProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (
    formData: BookForm,
    fileLists: { thumbnail?: UploadFile; slider?: UploadFile[] }
  ) => void;
}

const AddBook: React.FC<AddBookProps> = ({ visible, onClose, onAdd }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Tách fileList
      const thumbnailList = values.thumbnail;
      const sliderList = values.slider;

      const fileLists = {
        thumbnail: Array.isArray(thumbnailList) ? thumbnailList[0] : undefined,
        slider: Array.isArray(sliderList) ? sliderList : [],
      };

      delete values.thumbnail;
      delete values.slider;

      onAdd(values, fileLists);

      // console.log(values, fileLists);

      form.resetFields();
      onClose();
    } catch (error) {
      // console.log("Validate Failed:", error);
    }
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  // Kiểm tra file trước khi upload
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ được upload file JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return isJpgOrPng && isLt2M;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = (
    info: UploadChangeParam<UploadFile>,
    type: "thumbnail" | "slider"
  ) => {
    if (info.file.status === "uploading") {
      if (type === "thumbnail") setLoadingThumbnail(true);
      else setLoadingSlider(true);
      return;
    }
    if (info.file.status === "done" || info.file.status === "removed") {
      if (type === "thumbnail") setLoadingThumbnail(false);
      else setLoadingSlider(false);
    }
  };

  const customRequest: UploadProps["customRequest"] = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess && onSuccess("ok");
    }, 1000);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Modal
      title="Thêm Sản Phẩm"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText="Tạo Mới"
      cancelText="Hủy"
      maskClosable={false}
      destroyOnClose
      width={"70vw"}
    >
       <Divider />
      <Form form={form} layout="vertical" className="space-y-4">
        {/* Tên Sách - Nhà Xuất Bản */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Tên Sách"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Nhà Xuất Bản"
            name="publishers"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhà xuất bản" }]}
          >
            <Input className="w-full" />
          </Form.Item>
        </div>

        {/* Giá Cũ - Giá Mới - Số Lượng */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Giá Cũ" name="oldPrice">
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
            label="Giá Mới"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
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
            label="Số Lượng"
            name="quantily"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            initialValue=""
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>

        {/* Tác Giả - Thể Loại - Kích Thước Bao Bì */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Tác Giả"
            name="author"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 tác giả" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn Tác Giả"
              className="w-full"
              options={[
                { label: "Han Kang", value: "Han Kang" },
                { label: "Adam Grant", value: "Adam Grant" },
                { label: "Fredrik Backman", value: "Fredrik Backman" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Thể Loại"
            name="category"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 thể loại" },
            ]}
            initialValue=""
          >
            <Select className="w-full">
              <Select.Option value="History">History</Select.Option>
              <Select.Option value="Arts">Arts</Select.Option>
              <Select.Option value="Comics">Arts</Select.Option>
              <Select.Option value="Cookings">Cookings</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Kích Thước Bao Bì"
            name="size"
            initialValue=""
            rules={[
              { required: true, message: "Vui lòng nhập kích thước bao bì" },
            ]}
          >
            <Input className="w-full" />
          </Form.Item>
        </div>
        {/* Khối Lượng - Số Trang - Năm Xuất Bản */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Khối Lượng"
            name="weight"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhập khối lượng" }]}
          >
            <Input
              type="number"
              suffix={
                <span className="bg-gray-200 px-3 py-1 rounded-r-md text-black font-medium flex items-center">
                  gr
                </span>
              }
              className="text-right !pr-0 !py-0"
            />
          </Form.Item>

          <Form.Item
            label="Số Trang"
            name="page_count"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhập số trang" }]}
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Năm Xuất Bản"
            name="year"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhập năm xuất bản" }]}
          >
            <Input className="w-full" />
          </Form.Item>
        </div>

        {/* Hàng 4: Hình Thức - Trạng Thái */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Hình Thức"
            name="book_cover"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhập hình thức" }]}
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Trạng Thái"
            name="status"
            initialValue="Đang Hiện"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select className="w-full">
              <Select.Option value="Đang Hiện">Đang Hiện</Select.Option>
              <Select.Option value="Đang Ẩn">Đang Ẩn</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Hàng 5: Mô tả sản phẩm (1 cột) */}
        <Form.Item
          label="Mô tả sản phẩm"
          name="des"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={3} className="w-full" />
        </Form.Item>

        {/* Hàng 6: Ảnh Thumbnail - Ảnh Slider */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Ảnh Thumbnail"
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Vui lòng upload ít nhất 1 ảnh" },
            ]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              multiple={false}
              customRequest={customRequest}
              beforeUpload={beforeUpload}
              onChange={(info) => handleChange(info, "thumbnail")}
              onPreview={handlePreview}
            >
              <div>
                {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="mt-2">Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Ảnh Slider"
            name="slider"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              multiple
              customRequest={customRequest}
              beforeUpload={beforeUpload}
              onChange={(info) => handleChange(info, "slider")}
              onPreview={handlePreview}
            >
              <div>
                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="mt-2">Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </div>

        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => {
                if (!visible) {
                  setPreviewImage("");
                }
              },
            }}
            src={previewImage}
          />
        )}
      </Form>
    </Modal>
  );
};

export default AddBook;

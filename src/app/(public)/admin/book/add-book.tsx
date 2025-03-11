"use client";
import React, { useState, useEffect } from "react";
import {Modal,Form,Input,InputNumber,Select,Upload,Image,Divider,message,App,} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { UploadChangeParam } from "antd/es/upload";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { sendRequest } from "@/utils/api";

interface AddBookProps {
  visible: boolean;
  onAdd: (newBook: IBookTable) => void;
  onClose: () => void;
}

const AddBook: React.FC<AddBookProps> = ({ visible, onAdd, onClose }) => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await sendRequest<IBackendRes<IAuthor[]>>({
          url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/author`,
          method: "GET",
        });
        if (res.data) {
          setAuthors(res.data);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const res = await sendRequest<IBackendRes<IGenre[]>>({
          url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/genre`,
          method: "GET",
        });
        if (res.data) {
          setGenres(res.data);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchAuthors();
    fetchGenres();
  }, []);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ được upload file JPG/PNG!");
    }
    const isLtSize = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLtSize) {
      message.error(`Ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return isJpgOrPng && isLtSize;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    const getFullUrl = (filePath: string) => {
      if (filePath.startsWith("http")) {
        return filePath;
      }
      return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${filePath}`;
    };

    const previewUrl = file.url
      ? getFullUrl(file.url)
      : (file.preview as string);
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };

  const handleChange = (
    info: UploadChangeParam<UploadFile>,
    type: "thumbnail" | "slider"
  ) => {
    if (info.file.status === "uploading") {
      type === "thumbnail" ? setLoadingThumbnail(true) : setLoadingSlider(true);
      return;
    }
    if (info.file.status === "done" || info.file.status === "removed") {
      type === "thumbnail" ? setLoadingThumbnail(false) : setLoadingSlider(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onError,
    onSuccess,
  }) => {
    try {
      const uploadFile = file as RcFile & { url?: string };

      const formData = new FormData();
      formData.append("fileImg", uploadFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/file/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            "upload-type": "book",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Upload thất bại!");
      }

      uploadFile.url = data.data?.filePath || "";
      onSuccess?.(data, uploadFile as unknown as XMLHttpRequest);
      // console.log("File path từ server:", data.data?.filePath);
    } catch (error) {
      console.error("Lỗi upload:", error);
      onError?.(error as Error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const thumbnailList = values.thumbnail;
      const sliderList = values.slider;

      let thumbnailUrl = "";
      let sliderUrls: string[] = [];

      if (Array.isArray(thumbnailList) && thumbnailList.length > 0) {
        thumbnailUrl = thumbnailList[0]?.url || "";
      }
      if (Array.isArray(sliderList)) {
        sliderUrls = sliderList
          .map((file: any) => file.url)
          .filter((url: string) => url);
      }
      delete values.thumbnail;
      delete values.slider;

      const payload = {
        ...values,
        image: thumbnailUrl,
        slider: sliderUrls,
      };

      const res = await sendRequest<IBackendRes<IBookTable>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book`,
        method: "POST",
        body: payload,
      });

      if (
        res.statusCode === 200 ||
        res.statusCode === 201 ||
        res.statusCode === "200" ||
        res.statusCode === "201"
      ) {
        message.success('Tạo sản phẩm thành công!');
        if (res.data) {
          onAdd(res.data);
        }
      } else {
        message.error(res.message || "Tạo sản phẩm thất bại!");
      }
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error creating book:", error);
      message.error("Tạo sản phẩm thất bại!");
    }
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
      width={"60vw"}
      style={{ top: 20 }}
    >
      <Divider />
      <Form form={form} layout="vertical" className="space-y-4">
        {/* Tên Sách - Nhà Xuất Bản */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Tên Sách"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
            className="!mb-0"
          >
            <Input className="w-full" />
          </Form.Item>
          <Form.Item
            label="Nhà Xuất Bản"
            name="publishers"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhập nhà xuất bản" }]}
            className="!mb-0"
          >
            <Input className="w-full" />
          </Form.Item>
        </div>

        {/* Giá Cũ - Giá Mới - Số Lượng */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Giá Cũ"
            name="price_old"
            className="!mb-0"
            rules={[{ required: true, message: "Vui lòng nhập giá cũ" }]}
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
            label="Giá Mới"
            name="price_new"
            className="!mb-0"
            rules={[{ required: true, message: "Vui lòng nhập giá mới" }]}
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
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            initialValue=""
            className="!mb-0"
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>

        {/* Tác Giả - Thể Loại - Kích Thước Bao Bì */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Tác Giả"
            name="authors"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 tác giả" }]}
            className="!mb-0"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn Tác Giả"
              className="w-full !mb-0"
              options={authors.map((author) => ({
                label: author.name,
                value: author._id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Thể Loại"
            name="id_genre"
            rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
            initialValue=""
            className="!mb-0"
          >
            <Select className="w-full" placeholder="Chọn Thể Loại">
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kích Thước Bao Bì"
            name="size"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhập kích thước bao bì" }]}
            className="!mb-0"
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
            className="!mb-0"
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
            className="!mb-0"
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            label="Năm Xuất Bản"
            name="year"
            initialValue=""
            rules={[{ required: true, message: "Vui lòng nhập năm xuất bản" }]}
            className="!mb-0"
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>

        {/* Loại Bìa - Trạng Thái */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Loại Bìa"
            name="book_cover"
            initialValue=""
            className="!mb-0"
            rules={[{ required: true, message: "Vui lòng nhập hình thức" }]}
          >
            <Input className="w-full" />
          </Form.Item>
           <div></div>
           <div></div>
        </div>

        {/* Mô Tả */}
        <Form.Item
          label="Mô Tả Sản Phẩm"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          className="!mb-0"
        >
          <Input.TextArea rows={3} className="w-full" />
        </Form.Item>

        {/* Ảnh Thumbnail - Ảnh Slider */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Ảnh Thumbnail"
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Vui lòng upload ít nhất 1 ảnh" }]}
            className="!mb-0"
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
            className="!mb-0"
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

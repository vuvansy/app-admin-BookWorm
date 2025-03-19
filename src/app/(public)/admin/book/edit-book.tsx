"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Image,
  Divider,
  App,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { UploadChangeParam } from "antd/es/upload";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { sendRequest } from "@/utils/api";

const extractFilename = (url: string) => {
  if (!url) return "";
  try {
    const segments = url.split("/");
    return segments[segments.length - 1];
  } catch (error) {
    return url;
  }
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

interface EditBookProps {
  visible: boolean;
  onClose: () => void;
  onEditSuccess: (updatedBook: IBookTable) => void;
  initialBook: IBookTable;
}

const EditBook: React.FC<EditBookProps> = ({
  visible,
  onClose,
  onEditSuccess,
  initialBook,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await sendRequest<IBackendRes<IAuthor[]>>({
          url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/author`,
          method: "GET",
        });
        if (res.data) setAuthors(res.data);
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
        if (res.data) setGenres(res.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchAuthors();
    fetchGenres();
  }, []);

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

    setPreviewImage(previewUrl || "");
    setPreviewOpen(true);
  };

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

  const handleChange = (
    info: UploadChangeParam<UploadFile>,
    type: "thumbnail" | "slider"
  ) => {
    if (info.file.status === "uploading") {
      type === "thumbnail" ? setLoadingThumbnail(true) : setLoadingSlider(true);
      return;
    }
    if (info.file.status === "done" || info.file.status === "removed") {
      type === "thumbnail"
        ? setLoadingThumbnail(false)
        : setLoadingSlider(false);
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
    } catch (error) {
      console.error("Lỗi upload:", error);
      onError?.(error as Error);
    }
  };

  useEffect(() => {
    if (visible && initialBook) {
      const thumbnailFileList: UploadFile[] = initialBook.image
        ? [
            {
              uid: "-1",
              name: "thumbnail.png",
              status: "done",
              url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${initialBook.image}`,
            },
          ]
        : [];
      const sliderFileList: UploadFile[] =
        initialBook.slider && initialBook.slider.length > 0
          ? initialBook.slider.map((img, index) => ({
              uid: index.toString(),
              name: `slider-${index}.png`,
              status: "done",
              url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${img}`,
            }))
          : [];

      form.setFieldsValue({
        ...initialBook,
        authors: initialBook.authors?.map((author) => author._id),
        id_genre: initialBook.id_genre?._id,
        thumbnail: thumbnailFileList,
        slider: sliderFileList,
      });
    }
  }, [visible, initialBook, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const thumbnailList = values.thumbnail;
      const sliderList = values.slider;

      let updatedThumbnail = "";
      if (Array.isArray(thumbnailList) && thumbnailList.length > 0) {
        const rawUrl = thumbnailList[0].url || thumbnailList[0].preview;
        updatedThumbnail = extractFilename(rawUrl);
      }

      let updatedSlider: string[] = [];
      if (Array.isArray(sliderList) && sliderList.length > 0) {
        updatedSlider = sliderList.map((file: any) => {
          const rawUrl = file.url || file.preview;
          return extractFilename(rawUrl);
        });
      }

      const updatedBook: IBookTable = {
        ...initialBook,
        ...values,
        image: updatedThumbnail,
        slider: updatedSlider,
        updatedAt: new Date(),
      };

      const res = await sendRequest<IBackendRes<IBookTable>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book/${initialBook._id}`,
        method: "PUT",
        body: updatedBook,
      });

      if (res.data) {
        onEditSuccess(res.data);
        message.success("Cập nhật sách thành công!");
      } else {
        message.error("Cập nhật sách thất bại!");
      }
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  return (
    <Modal
      title="Chỉnh Sửa Sản Phẩm"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText="Cập Nhật"
      cancelText="Hủy"
      maskClosable={false}
      destroyOnClose
      style={{ top: 20 }}
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
            rules={[{ required: true, message: "Vui lòng nhập nhà xuất bản" }]}
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
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter=" đ"
            />
          </Form.Item>

          <Form.Item
            label="Giá Mới"
            name="price_new"
            className="!mb-0"
            dependencies={["price_old"]}
            rules={[
              { required: true, message: "Vui lòng nhập giá mới" },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const oldPrice = getFieldValue("price_old");
                  if (!value || (oldPrice && value < oldPrice)) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Giá mới phải nhỏ hơn giá cũ!");
                },
              }),
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter=" đ"
            />
          </Form.Item>

          <Form.Item
            label="Số Lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>

        {/* Tác Giả - Thể Loại -  Kích Thước Bao Bì * */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Tác Giả"
            name="authors"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 tác giả" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn Tác Giả"
              className="w-full"
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
          >
            <Select
              placeholder="Chọn Thể Loại"
              className="w-full"
              options={genres.map((genre) => ({
                label: genre.name,
                value: genre._id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Kích Thước Bao Bì"
            name="size"
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
            rules={[{ required: true, message: "Vui lòng nhập số trang" }]}
          >
            <Input className="w-full" />
          </Form.Item>
          <Form.Item
            label="Năm Xuất Bản"
            name="year"
            rules={[{ required: true, message: "Vui lòng nhập năm xuất bản" }]}
          >
            <Input className="w-full" />
          </Form.Item>
        </div>
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

        {/* Mô tả sản phẩm */}
        <Form.Item
          label="Mô tả sản phẩm"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
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

        {/* Preview ảnh toàn màn hình */}
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

export default EditBook;

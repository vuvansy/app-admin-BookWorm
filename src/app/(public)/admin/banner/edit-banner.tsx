"use client";
import React, { useEffect, useRef, useState } from "react";
import {Modal,Form,Input,Button, Divider,Upload,Image,Select,App,} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import type { UploadChangeParam } from "antd/es/upload";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { sendRequest } from "@/utils/api";

interface UpdateBannerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (updatedBanner: IBanner) => void;
  banner: IBanner | null;
}

const UpdateBanner: React.FC<UpdateBannerProps> = ({
  visible,
  onClose,
  onSubmit,
  banner,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loadingImage, setLoadingImage] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const getFullUrl = (filePath?: string) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) return filePath;
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/banner/${filePath}`;
  };

  useEffect(() => {
    if (visible && banner) {
      form.setFieldsValue({
        name: banner.name,
        status: banner.status ? 1 : 0,
        image: banner.image
          ? [
              {
                uid: "edit-banner-1",
                name: "banner-image",
                url: getFullUrl(banner.image),
              },
            ]
          : [],
      });
    }
  }, [visible, banner, form]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

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
            "upload-type": "banner",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload thất bại!");

      uploadFile.url = data.data?.filePath || "";
      onSuccess?.(data, uploadFile as unknown as XMLHttpRequest);
    } catch (error) {
      console.error("Lỗi upload:", error);
      onError?.(error as Error);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) message.error("Chỉ được upload file JPG/PNG!");
    const isLtSize = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLtSize)
      message.error(`Ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    return isJpgOrPng && isLtSize;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    const previewUrl = file.url
      ? getFullUrl(file.url)
      : (file.preview as string);
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoadingImage(true);
      return;
    }
    if (info.file.status === "done" || info.file.status === "removed") {
      setLoadingImage(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish = async (values: any) => {
    try {
      const thumbnailList = values.image;
      let thumbnailUrl = "";

      if (Array.isArray(thumbnailList) && thumbnailList.length > 0) {
        if (thumbnailList[0].originFileObj) {
          thumbnailUrl = thumbnailList[0].url || "";
        } else {
          const rawUrl = thumbnailList[0].url;
          thumbnailUrl = rawUrl.replace(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/banner/`,
            ""
          );
        }
      }

      const payload = {
        name: values.name,
        status: values.status === 1,
        image: thumbnailUrl,
      };

      const res = await sendRequest<IBackendRes<IBanner>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/banner/${banner?._id}`,
        method: "PUT",
        body: payload,
      });

      if (res.statusCode === 200 || res.statusCode === 201) {
        message.success("Cập nhật banner thành công!");
        onSubmit(res.data || { ...banner!, ...payload });
        onClose();
        form.resetFields();
      } else {
        message.error(res.message || "Cập nhật banner thất bại!");
      }
    } catch (err) {
      console.error("Error:", err);
      message.error("Cập nhật banner thất bại!");
    }
  };

  return (
    <Modal
      title="Chỉnh Sửa Banner"
      open={visible}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText={"Lưu"}
      cancelText={"Hủy"}
      width={"40vw"}
      maskClosable={false}
      destroyOnClose
    >
      <Divider />
      <Form
        form={form}
        name="update-banner"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Tiêu Đề Banner"
          name="name"
          rules={[{ required: true, message: "Không được để trống trường tiêu đề!" }]}
        >
          <Input />
        </Form.Item>

        <div className="flex justify-between gap-x-5">
          <Form.Item
            label="Trạng Thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            className="basis-6/12 !mb-3"
          >
            <Select
              placeholder="Chọn trạng thái"
              options={[
                { value: 0, label: "Đã Ẩn" },
                { value: 1, label: "Đang Hiện" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Hình Ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng upload hình ảnh!" }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="basis-6/12 !mb-3"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              customRequest={customRequest}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onPreview={handlePreview}
            >
              <div>
                {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </div>
      </Form>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => {
              if (!visible) {
                setPreviewImage("");
                document.body.focus();
              }
            },
          }}
          src={previewImage}
        />
      )}
    </Modal>
  );
};

export default UpdateBanner;

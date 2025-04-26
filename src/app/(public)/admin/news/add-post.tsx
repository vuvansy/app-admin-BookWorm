"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Switch,
  Divider,
  App,
  message,
  Select,
  Image,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { sendRequest } from "@/utils/api";
import dynamic from "next/dynamic";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";

const CKEditorNoSSR = dynamic(() => import("./CKEditorWrapper"), {
  ssr: false,
});

interface CreatePostProps {
  visible: boolean;
  onAdd: (newPost: any) => void;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ visible, onAdd, onClose }) => {
  const [form] = Form.useForm();
  const { message: antdMessage } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (!visible) setEditorContent("");
  }, [visible]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) antdMessage.error("Chỉ được upload file JPG/PNG!");
    const isLtSize = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLtSize)
      antdMessage.error(`Ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    return isJpgOrPng && isLtSize;
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
          headers: { "upload-type": "post" },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload thất bại!");
      uploadFile.url = data.data.filePath || "";
      onSuccess?.(data, uploadFile as unknown as XMLHttpRequest);
    } catch (err) {
      console.error(err);
      onError?.(err as Error);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    const getFullUrl = (filePath: string) => {
      if (filePath.startsWith("http")) {
        return filePath;
      }
      return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/post/${filePath}`;
    };

    const previewUrl = file.url
      ? getFullUrl(file.url)
      : (file.preview as string);
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };

  const handleOk = async () => {
    try {
      
      form.setFieldsValue({ content: editorContent });
      const values = await form.validateFields();
      setLoading(true);

      const fileList: UploadFile[] = values.image || [];
      const imageUrl = fileList[0]?.url || "";

      const payload = {
        title: values.title,
        image: imageUrl,
        excerpt: values.excerpt,
        content: values.content,
        status: values.status,
      };

      const res = await sendRequest<IBackendRes<IPost>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/post`,
        method: "POST",
        body: payload,
      });

      antdMessage.success("Tạo Post thành công!");
      onAdd(res.data);
      form.resetFields();
      setEditorContent("");
      onClose();
    } catch (err) {
      console.error(err);
      antdMessage.error("Tạo Post thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Mới Post"
      open={visible}
      onCancel={() => {
        form.resetFields();
        setEditorContent("");
        onClose();
      }}
      onOk={handleOk}
      okText="Tạo Mới"
      cancelText="Huỷ"
      maskClosable={false}
      width={600}
      confirmLoading={loading}
    >
      <Divider />
      <Form form={form} layout="vertical">
        {/* Title */}
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>
        {/* Excerpt */}
        <Form.Item
          label="Mô tả ngắn"
          name="excerpt"
          rules={[{ required: true, message: "Vui lòng nhập trích dẫn" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        {/* Content CKEditor */}
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <CKEditorNoSSR
            value={editorContent}
            onChange={(data) => {
              setEditorContent(data);
              form.setFieldsValue({ content: data });
            }}
          />
        </Form.Item>

        <div className="flex *:gap-4">
          {/* Status */}
          <Form.Item  
          className="flex-1 pr-5"
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={true}>Hiển Thị</Select.Option>
              <Select.Option value={false}>Ẩn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
          className="flex-1 "
            label="Ảnh bài viết"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Vui lòng upload ảnh" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              customRequest={customRequest}
              beforeUpload={beforeUpload}
              onPreview={handlePreview}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
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

export default CreatePost;

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Divider,
  App,
  Image,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import dynamic from "next/dynamic";
import { sendRequest } from "@/utils/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";

const CKEditorNoSSR = dynamic(() => import("./CKEditorWrapper"), {
  ssr: false,
});

// Lấy tên file từ đường dẫn hoặc URL
const extractFilename = (url: string) => {
  if (!url) return "";
  const segments = url.split("/");
  return segments[segments.length - 1];
};

// Chuyển RcFile sang base64 để preview
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

// export interface IPost {
//   id: number | string;
//   title: string;
//   excerpt: string;
//   content: string;
//   image: string;
//   status: boolean;
// }

interface EditPostProps {
  visible: boolean;
  post: IPost;
  onEdit: (updated: IPost) => void;
  onClose: () => void;
}

const EditPost: React.FC<EditPostProps> = ({ visible, post, onEdit, onClose }) => {
  const [form] = Form.useForm();
  const { message: antdMessage } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");

  // Tạo URL đầy đủ cho ảnh
  const getFullUrl = (filePath: string) =>
    filePath.startsWith("http")
      ? filePath
      : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/post/${filePath}`;

  useEffect(() => {
    if (visible && post) {
      setEditorContent(post.content);

      // Khởi tạo fileList cho Upload với ảnh cũ
      const fileList: UploadFile[] = post.image
        ? [{
            uid: '-1',
            name: extractFilename(post.image),
            status: 'done',
            url: getFullUrl(post.image),
          }]
        : [];

      form.setFieldsValue({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status,
        image: fileList,
      });
    }
    if (!visible) {
      form.resetFields();
      setEditorContent("");
    }
  }, [visible, post, form]);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) antdMessage.error("Chỉ được upload file JPG/PNG!");
    const isLtSize = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLtSize) antdMessage.error(`Ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    return isJpgOrPng && isLtSize;
  };

  const customRequest: UploadProps["customRequest"] = async ({ file, onError, onSuccess }) => {
    try {
      const uploadFile = file as RcFile & { url?: string };
      const formData = new FormData();
      formData.append("fileImg", uploadFile);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/file/upload`,
        { method: "POST", body: formData, headers: { "upload-type": "post" } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload thất bại!");
      // chỉ lưu tên file, preview và useEffect sẽ sinh URL đầy đủ
      uploadFile.url = data.data.filePath || "";
      onSuccess?.(data, uploadFile as any);
    } catch (err) {
      console.error(err);
      onError?.(err as Error);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    const raw = file.url || file.preview;
    const previewUrl = file.url ? getFullUrl(raw as string) : raw;
    setPreviewImage(previewUrl as string);
    setPreviewOpen(true);
  };

  const handleOk = async () => {
    try {
    
      form.setFieldsValue({ content: editorContent });
      const values = await form.validateFields();
      setLoading(true);

      const fileList: UploadFile[] = values.image || [];
      const rawUrl = fileList[0]?.url || fileList[0]?.preview;
      const filename = extractFilename(rawUrl as string);

      const payload: IPost = {
        ...post,
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        status: values.status,
        image: filename,
      };

      const res = await sendRequest<{ data: IPost }>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/post/${post._id}`,
        method: "PUT",
        body: payload,
      });

      antdMessage.success("Cập nhật Post thành công!");
      onEdit(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      antdMessage.error("Cập nhật Post thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh Sửa Post"
      open={visible}
      onCancel={() => { onClose(); }}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Huỷ"
      maskClosable={false}
      width={600}
      confirmLoading={loading}
    >
      <Divider />
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả ngắn"
          name="excerpt"
          rules={[{ required: true, message: "Vui lòng nhập trích dẫn" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <CKEditorNoSSR
            value={editorContent}
            onChange={(data) => setEditorContent(data)}
          />
        </Form.Item>

        <div className="flex *:gap-4">
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
            className="flex-1"
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
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
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
              onVisibleChange: (vis) => setPreviewOpen(vis),
              afterOpenChange: (vis) => { if (!vis) setPreviewImage(""); },
            }}
            src={previewImage}
          />
        )}
      </Form>
    </Modal>
  );
};

export default EditPost;

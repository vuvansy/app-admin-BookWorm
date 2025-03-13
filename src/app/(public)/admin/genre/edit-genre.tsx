"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  InputRef,
  Divider,
  Upload,
  Image,
  message,
  App,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import type { UploadChangeParam } from "antd/es/upload";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { sendRequest } from "@/utils/api";

interface EditGenreProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (updatedGenre: IGenre) => void;
  genre: IGenre  | null;
}

const EditGenre: React.FC<EditGenreProps> = ({
  visible,
  onClose,
  onSubmit,
  genre,
}) => {
  const [form] = Form.useForm();
  const inputRef = useRef<InputRef | null>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const { message, notification} = App.useApp();
  const [loadingImage, setLoadingImage] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
   


  const getFullUrl = (filePath?: string) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) {
      return filePath;
    }
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/genre/${filePath}`;
  };

  useEffect(() => {
    if (visible && genre) {
      form.setFieldsValue({
        name: genre.name,
        thumbnail: genre.image
          ? [
              {
                uid: "edit-genre-1",       
                name: "genre-image",         
                url: getFullUrl(genre.image) 
              },
            ]
          : [],
      });
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => editButtonRef.current?.focus(), 100);
    }
  }, [visible, genre, form]);

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
            "upload-type": "genre",
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

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === "image/jpeg" || file.type === "image/png";
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
      return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/genre/${filePath}`;
    };
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const thumbnailList = values.thumbnail;
      let thumbnailUrl = "";
      if (Array.isArray(thumbnailList) && thumbnailList.length > 0) {
        thumbnailUrl = thumbnailList[0]?.url || "";
      }
      const payload = {
        name: values.name,
        image: thumbnailUrl,
      };

      const res = await sendRequest<IBackendRes<IGenre>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/genre/${genre?._id}`,
        method: "PUT",
        body: payload,
      });

      if (
        res.statusCode === 200 ||
        res.statusCode === 201 ||
        res.statusCode === "200" ||
        res.statusCode === "201"
      ) {
        message.success("Chỉnh sửa danh mục thành công!");
         
        const updatedGenre: IGenre = res.data
        ? res.data
        : {
            _id: genre?._id || "",
            name: values.name,
            image: thumbnailUrl,
          };

      onSubmit(updatedGenre);
    } else {
      message.error(res.message || "Chỉnh sửa danh mục thất bại!");
      return;
      } 

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error updating genre:", error);
      message.error("Chỉnh sửa danh mục thất bại!");
    }
  };

  return (
    <>
      <Button ref={editButtonRef} style={{ display: "none" }} />
      <Modal
        title="Chỉnh Sửa Danh Mục"
        open={visible}
        onCancel={onClose}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Divider />
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên Danh Mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
          >
            <Input ref={inputRef} placeholder="Nhập tên thể loại" />
          </Form.Item>
          <Form.Item
            label="Hình Ảnh"
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              multiple={false}
              customRequest={customRequest}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onPreview={handlePreview}
            >
              <div>
                {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="mt-2">Upload</div>
              </div>
            </Upload>
          </Form.Item>
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
    </>
  );
};

export default EditGenre;

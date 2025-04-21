"use client";

import { App, Modal, Select, Upload, Form, Input, Divider, Image, message } from "antd";
import { useState } from "react";
import type { FormProps } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadChangeParam } from "antd/es/upload";
import type { RcFile } from "antd/es/upload";
import { sendRequest } from "@/utils/api";

type FieldType = {
  name: string;
  status: number;
  image: string;
};

interface IProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newBanner: any) => void; 
}

const CreateBanner = (props: IProps) => {
  const { visible, onClose, onAdd } = props;
  const { message: antdMessage } = App.useApp();
  const [form] = Form.useForm<FieldType>();

  const [isSubmit, setIsSubmit] = useState(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");


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
      antdMessage.error("Bạn chỉ được upload file JPG/PNG!");
    }
    const isLtSize = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLtSize) {
      antdMessage.error(`Ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
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
        return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/banner/${filePath}`;
      };
     const previewUrl = file.url
     ? getFullUrl(file.url)
     : (file.preview as string);
   setPreviewImage(previewUrl);
   setPreviewOpen(true);
 };
 
  const handleChange = (info: UploadChangeParam<UploadFile>, type: "thumbnail" | "slider") => {
    if (info.file.status === "uploading") {
      if (type === "thumbnail") setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      if (type === "thumbnail") setLoadingThumbnail(false);
    }
  };

  const handleUploadFile: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
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


  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      const fileList = values.image as unknown as UploadFile[];
      let imageUrl = "";
      if (Array.isArray(fileList) && fileList.length > 0) {
        imageUrl = fileList[0]?.url || "";
      }

      const payload = {
        name: values.name,
        status: values.status,
        image: imageUrl,
      };

      const res = await sendRequest<IBackendRes<IBanner>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/banner`,
        method: "POST",
        body: payload,
      });
      if (
        res.statusCode === 200 ||
        res.statusCode === 201 ||
        res.statusCode === "200" ||
        res.statusCode === "201"
      ) {
        message.success("Tạo Banner thành công!");
        form.resetFields();
        onAdd(res.data!);
        onClose();
      } else {
        message.error(res.message || "Tạo Banner thất bại!");
      }
    } catch (error) {
      console.error("Lỗi tạo Banner:", error);
      message.error("Tạo Banner thất bại!");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Thêm Mới Banner"
      open={visible}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText={"Tạo mới"}
      cancelText={"Hủy"}
      width={"40vw"}
      maskClosable={false}
      destroyOnClose={true}
    >
      <Divider />
      <Form
        form={form}
        name="create-banner"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        initialValues={{ status: 1 }}
      >
        <Form.Item<FieldType>
          label="Tiêu Đề Banner"
          name="name"
          rules={[{ required: true, message: "Không được để trống trường tiêu đề!" }]}
        >
          <Input />
        </Form.Item>
        <div className="flex justify-between gap-x-5">
          <Form.Item<FieldType>
            label="Trạng Thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            className="basis-6/12 !mb-3"
          >
            <Select
              showSearch
              allowClear
              placeholder="Chọn trạng thái"
              options={[
                { value: 0, label: "Đã Ẩn" },
                { value: 1, label: "Đang Hiện" },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
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
              multiple={false}
              customRequest={handleUploadFile}
              beforeUpload={beforeUpload}
              onChange={(info) => handleChange(info, "thumbnail")}
              onPreview={handlePreview}
            >
              <div>
                {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
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

export default CreateBanner;

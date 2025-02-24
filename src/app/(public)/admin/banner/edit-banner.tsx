"use client"

import { App, Modal, Select, Upload, Form, Input, Divider, Image } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { UploadChangeParam } from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload';

type FieldType = {
    name: string;
    status: number;
    image: string;
};

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;

}

const UpdateBanner = (props: IProps) => {

    const { openModalUpdate, setOpenModalUpdate } = props;

    const { message, notification } = App.useApp();
    const [form] = Form.useForm();


    const [isSubmit, setIsSubmit] = useState(false);


    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        console.log(values)
        setIsSubmit(false)
    };

    const getBase64 = (file: RcFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            if (onSuccess)
                onSuccess("ok");
        }, 1000);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Modal title="Chỉnh Sửa Banner"
            open={openModalUpdate}
            onOk={() => { form.submit() }}
            onCancel={() => {
                form.resetFields();
                setOpenModalUpdate(false);
            }}
            okText={"Cập nhật"}
            cancelText={"Hủy"}
            width={"40vw"}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Divider />
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                initialValues={{ status: 1 }}
            >
                <Form.Item<FieldType>
                    label="Tiêu Đề Banner"
                    name="name"
                    rules={[{ required: true, message: 'Không được để trống trường tiêu đề!' }]}
                >
                    <Input />
                </Form.Item>
                <div className="flex justify-between gap-x-5">
                    <Form.Item<FieldType>
                        label="Trạng Thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        className="basis-6/12 !mb-3"
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Chọn Trạng Thái"
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
                        rules={[{ required: true, message: 'Vui lòng nhập upload thumbnail!' }]}

                        //convert value from Upload => form
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        className="basis-6/12 !mb-3"
                    >
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            maxCount={1}
                            multiple={false}
                            customRequest={handleUploadFile}
                            beforeUpload={beforeUpload}
                            onChange={(info) => handleChange(info, 'thumbnail')}
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
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => {
                            if (!visible) {
                                setPreviewImage(""); // Reset ảnh preview khi đóng
                                document.body.focus(); // Bỏ focus khỏi phần tử bị ẩn
                            }
                        },
                    }}
                    src={previewImage}
                />
            )}
        </Modal>
    )
}

export default UpdateBanner
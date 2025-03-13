'use client'

import React, { useState } from 'react';
import { Button, Checkbox, Col, Form, Input, Row, Select, Image, App, Upload } from 'antd';
import { PlusOutlined, ImportOutlined, ExportOutlined, EditTwoTone, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

type AddressType = {
    city?: string;
    district?: string;
    ward?: string;
    specific_address?: string;
};
type FieldType = {

    fullName: string;
    email: string;
    phone: string;
    address?: AddressType;
    image: string;

};

const AccountForm = () => {
    const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();
    const defaultAvatarUrl = 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'; // URL của ảnh avatar mặc định

    const handleUpload = (info: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        setFile(info.file);
        reader.readAsDataURL(info.file);
    };

    const handleRemove = () => {
        setImageUrl(null);
        setFile(null);
    };

    const handleSubmit = (values: any) => {
        const formData = { ...values, image: file };
        console.log('Form Data:', formData);
    };
    // const onFinish = (values: any) => {
    //     console.log('Success:', values);

    // };

    // const onFinishFailed = (errorInfo: any) => {
    //     console.log('Failed:', errorInfo);
    // };

    return (

        <div className=" bg-white py-7 rounded mt-1 mx-auto">
            <div className=' w-[80vw] mx-auto'>
                <div className=" text-heading3  flex items-center justify-center">Thông Tin Cá Nhân</div>
                <Form
                    name="form-add"
                    className='max-w-[1200px] !pt-5'
                    form={form}
                    onFinish={handleSubmit}
                    autoComplete="off"
                    layout="vertical"
                >

                    <div className='flex justify-between'>
                        <div className='basis-1/6 h-60 ml-5 rounded-[10px] border-2 flex align-center justify-center'>
                            <Form.Item
                                name="image"
                            >
                                <div>
                                    <Image src={typeof imageUrl === 'string' ? imageUrl : defaultAvatarUrl} alt="Uploaded" width={130} height={130} className="mt-4 rounded-full"

                                        preview={{
                                            maskClassName: "rounded-full w-[100%] h-[100%] mt-4",
                                            mask: (
                                                <div className="flex justify-center items-center gap-x-10">
                                                    <EyeOutlined />
                                                    <DeleteOutlined onClick={handleRemove} />
                                                </div>
                                            )
                                        }}
                                    />
                                    <div className='flex justify-center mt-[45px] '>
                                        <Upload beforeUpload={() => false} showUploadList={false} onChange={handleUpload}>
                                            <Button>Chọn Ảnh</Button>
                                        </Upload>
                                    </div>
                                </div>
                            </Form.Item>
                        </div>

                        <div className='basis-4/5'>
                            <div className='flex justify-between gap-x-5'>
                                <Form.Item<FieldType>
                                    name="fullName"
                                    label="Tên Hiển Thị"
                                    rules={[{ required: true, message: 'Hãy nhập tên hiển thị!' }]}
                                    className='basis-1/2'
                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item<FieldType>
                                    name="email"
                                    label="Email"
                                    className='basis-1/2'
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div className='flex justify-between gap-x-5'>
                                <Form.Item<FieldType>
                                    name="phone"
                                    label="Số Điện Thoại"
                                    rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
                                    className='w-[49%]'
                                >
                                    <Input />
                                </Form.Item>

                            </div>
                            <div className=' flex justify-between gap-x-5'>
                                <Form.Item<FieldType>
                                    name={['address', 'city']}
                                    label="Chọn Tỉnh / Thành Phố"
                                    className='flex-1'
                                >
                                    <Select placeholder="Chọn một tỉnh / thành phố" allowClear >
                                        <Option value="demo">Demo</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item<FieldType>
                                    name={['address', 'district']}
                                    label="Chọn Quận / Huyện"
                                    className='flex-1'
                                >
                                    <Select placeholder="Chọn một quận / huyện" allowClear>
                                        <Option value="demo">Demo</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item<FieldType>
                                    name={['address', 'ward']}
                                    label="Chọn Phường / Xã"
                                    className='flex-1'
                                >
                                    <Select placeholder="Chọn một phường / xã" allowClear>
                                        <Option value="demo">Demo</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            <Form.Item
                                name={['address', 'specific_address']}
                                label="Nhập Địa Chỉ Cụ Thể"
                            >
                                <Input />
                            </Form.Item>

                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <Button type="primary" danger htmlType="submit" className='w-[20%]'>Lưu Thay Đổi</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default AccountForm;

'use client'

import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'next/link';

const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

type FieldType = {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
};

const ChangePasswordForm = () => (
    <div className="container flex justify-center bg-white py-7 rounded mt-1">
        <div className=' w-[40vw] mx-auto'>
            <div className=" text-heading3  flex items-center justify-center">Đổi Mật Khẩu</div>
            <Form
                name="basic"
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                // style={{ maxWidth: 600, marginTop: "50px" }}
                className='max-w-[800px] !pt-5'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Mật Khẩu Cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Hãy nhập mật khẩu cũ!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Mật Khẩu Mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Hãy nhập mật khẩu mới!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Xác Nhận Mật Khẩu"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Hãy nhập xác nhận mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Button type="primary" danger htmlType="submit" className='w-full'>Lưu Thay Đổi</Button>
            </Form>
        </div>
    </div>




);

export default ChangePasswordForm;



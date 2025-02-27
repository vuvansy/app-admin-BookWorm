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
    password?: string;
    confirmPassword?: string;
};

const UpdatePasswordForm = () => (
    <div className="w-full max-w-[800px] mx-auto mt-5">
        <div className=" text-heading3  flex items-center justify-center">Cập Nhật Mật Khẩu</div>
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
                label="Mật Khẩu Mới"
                name="password"
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




);

export default UpdatePasswordForm;



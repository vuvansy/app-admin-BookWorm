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
    email?: string;
};

const ForgotPasswordForm = () => (
    <div className="w-full max-w-[800px] mx-auto mt-5">
        <div className=" text-heading3  flex items-center justify-center">Quên Mật Khẩu</div>
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
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Hãy nhập Email!' }]}
            >
                <Input />
            </Form.Item>

            <Button type="primary" danger htmlType="submit" className='w-full'>Gửi Yêu Cầu</Button>
        </Form>
    </div>




);

export default ForgotPasswordForm;



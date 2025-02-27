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
    fullname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    remember?: string;
};

const RegisterForm = () => (
    <div className="w-full max-w-[800px] mx-auto mt-5">
        <div className=" text-heading3  flex items-center justify-center">Đăng Ký</div>
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
                label="Họ và Tên"
                name="fullname"
                rules={[{ required: true, message: 'Hãy nhập họ và tên!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Hãy nhập Email!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Mật Khẩu"
                name="password"
                rules={[{ required: true, message: 'Không được để trống mật khẩu!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
                label="Xác Nhận Mật Khẩu"
                name="confirmPassword"
                rules={[{ required: true, message: 'Không được để trống xác nhận mật khẩu!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Button type="primary" danger htmlType="submit" className='w-full'>Đăng Ký</Button>
            <div className='h-5 my-[10px] text-body1 items-center flex justify-between'>
                <span>Bạn đã có tài khoản? <Link href="/login" className='text-red1'>Đăng nhập ngay</Link></span>
            </div>
            <div className=' mb-[10px] text-body1 items-center flex justify-between'>
                <Link href="/forgot-password" className='text-red1'>Quên mật khẩu</Link>
            </div>
        </Form>
    </div>




);

export default RegisterForm;
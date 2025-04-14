'use client'

import React, { useEffect, useState } from 'react';
import { App, Button, Checkbox, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FieldType = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

const ChangePasswordForm = () => {
    // const router = useRouter();
    const [form] = Form.useForm();
    const { message, modal, notification } = App.useApp();
    const [token, setToken] = useState<string | null>(null);

    // Lấy token từ localStorage trong client
    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        setToken(storedToken);
    }, []);
    const onFinish = async (values: any) => {
        if (!token) {
            message.error('Không tìm thấy token đăng nhập.');
            return;
        }

        const { current_password, new_password, confirm_password } = values;
        const data = { current_password, new_password, confirm_password };
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/change-password`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                }
            );
            const d = await res.json();
            if (d.statusCode === 200) {
                message.success(d.message);
                // setTimeout(() => form.resetFields(), 0);
                form.resetFields();
            }
            else {
                message.error(d.message);
            }
        } catch (error) {
            console.log('error', error)
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className=" flex justify-center bg-white py-7 rounded mt-1">
            <div className=' w-[40vw] mx-auto'>
                <div className=" text-heading3  flex items-center justify-center">Đổi Mật Khẩu</div>
                <Form
                    form={form}
                    name="basic"
                    className='max-w-[800px] !pt-5'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Mật khẩu cũ"
                        name="current_password"
                        rules={[{ required: true, message: 'Hãy Nhập Mật Khẩu Cũ!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mật khẩu mới"
                        name="new_password"
                        rules={[{ required: true, message: 'Hãy Nhập Mật Khẩu Mới!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Xác nhận mật khẩu"
                        name="confirm_password"
                        rules={[{ required: true, message: 'Hãy Nhập Xác Nhận Mật Khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" danger htmlType="submit" className='w-full'>Lưu Thay Đổi</Button>
                </Form>
            </div>
        </div>
    );
};

export default ChangePasswordForm;

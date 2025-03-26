'use client'

import React, { useEffect } from 'react';
import { App, Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useCurrentApp } from '@/context/app.context';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

type FieldType = {
    email: string;
    password: string;
};

const LoginForm = () => {
    const { setIsAuthenticated, setUser, user } = useCurrentApp();
    const { message, notification } = App.useApp();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const redirectTo = searchParams.get("redirect");
        if (user && redirectTo) {
            router.push(redirectTo);
        }
    }, [user]);

    const onFinish = async (values: any) => {
        try {
            const { email, password } = values;
            const data = { email, password };

            // Step 1: Login with credentials
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(data)
                }
            );

            const dataRes: IBackendRes<ILogin> = await res.json();

            if (dataRes.data) {
                // If user role is not ADMIN, show error and don't proceed
                if (dataRes.data.user.role !== 'ADMIN') {
                    message.error('Bạn không có quyền truy cập vào hệ thống. Chỉ người dùng với vai trò ADMIN mới được phép đăng nhập.');
                    return;
                }

                // User is ADMIN, proceed with setting auth state
                setIsAuthenticated(true);
                // setUser(dataRes.data.user);
                localStorage.setItem('access_token', dataRes.data.access_token);
                message.success('Đăng nhập tài khoản thành công!');
                router.push('/');
            } else {
                notification.error({
                    message: 'Lỗi Đăng Nhập',
                    description: (dataRes.message),
                });
            }
        } catch (error) {
            console.error('Error:', error);
            notification.error({
                message: 'Lỗi Đăng Nhập',
                description: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.',
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="w-full max-w-[400px] mx-auto mt-5">
            <Image src={'/icon/logo.png'} alt="BookWorm" width={350} height={0} className='mx-auto mb-7 mt-10' />
            <div className="text-heading3 flex items-center justify-center">QUẢN TRỊ VIÊN</div>
            <Form
                name="basic"
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

                <Form.Item<FieldType>
                    label="Mật Khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Không được để trống Password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Button type="primary" danger htmlType="submit" className='w-full'>Đăng Nhập</Button>

                {/* <div className='my-[10px] text-body1 items-center flex justify-between'>
                    <span>Bạn chưa có tài khoản? <Link href="/register" className='text-red1'>Đăng ký ngay</Link></span>
                </div>

                <div className='mb-[10px] text-body1 items-center flex justify-between'>
                    <Link href="/forgot-password" className='text-red1'>Quên mật khẩu</Link>
                </div> */}
            </Form>
        </div>
    );
};

export default LoginForm;

'use client'

import React, { useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, ConfigProvider, Modal } from 'antd';
import { User } from './user-table';

const { Option } = Select;

interface ModalEditProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onFinish: (values: User) => void;
}

const ModalEdit: React.FC<ModalEditProps> = ({ open, user, onClose, onFinish }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
        }
    }, [user, form]);
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgMask: 'rgba(0,0,0,0.1)',
                },
            }}
        >
            <Modal
                title="Chỉnh sửa người dùng"
                width={600}
                footer={null}
                maskClosable={true}
                onCancel={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <Form
                    name="form-edit"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    size="large"
                    initialValues={user || undefined}
                >

                    <Form.Item
                        name="fullName"
                        label="Tên hiển thị"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Ủy quyền"
                    >
                        <Select>
                            <Option value="ADMIN">Tài khoản quản trị</Option>
                            <Option value="USER">Tài khoản khách hàng</Option>
                        </Select>
                    </Form.Item>

                    <div className="flex justify-end gap-x-[15px]">
                        <Button onClick={onClose}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </div>
                </Form>
            </Modal>
        </ConfigProvider>

    );
};

export default ModalEdit;
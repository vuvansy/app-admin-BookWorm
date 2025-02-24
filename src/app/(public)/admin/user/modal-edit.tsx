'use client'

import React, { useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, ConfigProvider, Modal, Row, Col, Divider } from 'antd';
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
                title="Chỉnh Sửa Người Dùng"
                width={1020}
                footer={null}
                maskClosable={true}
                onCancel={onClose}
                open={open}
            >
                <Divider />
                <Form
                    form={form}
                    name="form-edit"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    initialValues={user || undefined}
                >


                    <div className='flex justify-between gap-x-5'>
                        <Form.Item
                            name="fullName"
                            label="Tên Hiển Thị"
                            rules={[{ required: true, message: 'Hãy nhập tên hiển thị!' }]}
                            className='basis-1/2'
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Hãy nhập Email!' }]}
                            className='basis-1/2'
                        >
                            <Input disabled />
                        </Form.Item>
                    </div>

                    <div className='flex justify-between gap-x-5'>
                        <Form.Item
                            name="phone"
                            label="Số Điện Thoại"
                            rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
                            className='basis-1/2'
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Ủy Quyền"
                            className='basis-1/2'
                        >
                            <Select>
                                <Option value="ADMIN">Tài khoản quản trị</Option>
                                <Option value="USER">Tài khoản khách hàng</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name={['address', 'city']}
                                        label="Chọn Tỉnh / Thành Phố"
                                        rules={[{ required: true, message: 'Hãy chọn tỉnh / thành phố!' }]}
                                    >
                                        <Select placeholder="Chọn một tỉnh / thành phố" allowClear >
                                            <Option value="demo">Demo</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name={['address', 'district']}
                                        label="Chọn Quận / Huyện"
                                        rules={[{ required: true, message: 'Hãy chọn quận / huyện!' }]}
                                    >
                                        <Select placeholder="Chọn một quận / huyện" allowClear>
                                            <Option value="demo">Demo</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name={['address', 'ward']}
                                        label="Chọn Phường / Xã"
                                        rules={[{ required: true, message: 'Hãy chọn phường / xã!' }]}
                                    >
                                        <Select placeholder="Chọn một phường / xã" allowClear>
                                            <Option value="demo">Demo</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name={['address', 'specific_address']}
                                        label="Nhập Địa Chỉ Cụ Thể"
                                        rules={[{ required: true, message: 'Hãy nhập địa chỉ cụ thể!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    </div>

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
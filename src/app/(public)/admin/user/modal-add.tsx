'use client'
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, DatePicker, Divider, Drawer, Form, FormProps, Input, Modal, Row, Select, Space } from 'antd';

const { Option } = Select;

type AddressType = {
    city?: string;
    district?: string;
    ward?: string;
    specific_address?: string;
};
type FieldType = {
    role?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: AddressType;
    password?: string;
    confirmPassword?: string;

};

const ModalAdd = () => {
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values)
    };
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>Thêm mới</Button>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgMask: 'rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Modal
                    title="Thêm Mới Người Dùng"
                    width={1020}
                    footer={null}
                    maskClosable={true}
                    onCancel={onClose}
                    open={open}
                >
                    <Divider />
                    <Form
                        name="form-add"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        initialValues={{ role: 'USER' }}
                    >


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
                                rules={[{ required: true, message: 'Hãy nhập Email!' }]}
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
                                className='basis-1/2'
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
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
                        <div className='flex justify-between gap-x-5'>
                            <Form.Item<FieldType>
                                name="password"
                                label="Mật Khẩu"
                                rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
                                className='basis-1/2'
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="confirmPassword"
                                label="Xác Nhận Mật Khẩu"
                                rules={[{ required: true, message: 'Hãy xác nhận mật khẩu!' }]}
                                className='basis-1/2'
                            >
                                <Input.Password />
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

                        <div className='flex justify-end gap-x-[15px]'>
                            <Button onClick={onClose}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                Tạo mới
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </ConfigProvider>

        </>
    );
};

export default ModalAdd;
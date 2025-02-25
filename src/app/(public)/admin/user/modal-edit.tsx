'use client'

import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Button, ConfigProvider, Modal, Row, Col, Divider, FormProps, App } from 'antd';
import { User } from './user-table';

const { Option } = Select;

type AddressType = {
    city: string;
    district: string;
    ward: string;
    specific_address: string;
};
type FieldType = {
    role: string;
    fullName: string;
    email: string;
    phone: string;
    address: AddressType;
    password: string;
    confirmPassword: string;

};
interface Props {
    openEdit: boolean;
    user: User | null;
    setOpenEdit: (values: boolean) => void;
}

const ModalEdit = (props: Props) => {
    const { openEdit, setOpenEdit, user } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, modal, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
        }
    }, [user, form]);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        message.success('Success!');
        console.log(values);
        setOpenEdit(false);
        form.resetFields();
        setIsSubmit(false);
    };
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
                width={"70vw"}
                onOk={() => { form.submit() }}
                okText={"Cập Nhật"}
                cancelText={"Hủy"}
                destroyOnClose={true}
                maskClosable={false}
                onCancel={() => {
                    form.resetFields();
                    setOpenEdit(false);
                }}
                open={openEdit}
            >
                <Divider />
                <Form
                    form={form}
                    name="form-add"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
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
                            <Input disabled />
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
                            <Select
                                options={[
                                    { value: "ADMIN", label: "Tài Khoản Quản Trị" },
                                    { value: "USER", label: "Tài Khoản Khách Hàng" },

                                ]}
                            />
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
                </Form>
            </Modal>
        </ConfigProvider>

    );
};

export default ModalEdit;
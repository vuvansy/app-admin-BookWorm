'use client'
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, DatePicker, Drawer, Form, FormProps, Input, Modal, Row, Select, Space } from 'antd';

const { Option } = Select;

type FieldType = {
    role?: string;
    fullName?: string;
    email?: string;
    phone?: string;

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
            <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>Add New</Button>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgMask: 'rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Modal
                    title="Thêm mới người dùng"
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
                    <Form name="form-add" onFinish={onFinish} autoComplete="off" layout="vertical" size='large' initialValues={{ role: 'USER' }}>

                        <Form.Item<FieldType>
                            name="role"
                            label="Ủy quyền"
                        >
                            <Select>
                                <Option value="ADMIN">Tài khoản quản trị</Option>
                                <Option value="USER">Tài khoản khách hàng</Option>
                            </Select>
                        </Form.Item>



                        <Form.Item<FieldType>
                            name="fullName"
                            label="Tên hiển thị"
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item<FieldType>
                            name="email"
                            label="Email"
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item<FieldType>
                            name="phone"
                            label="Số điện thoại"
                        >
                            <Input />
                        </Form.Item>

                        <div className='flex justify-end gap-x-[15px]'>
                            <Button onClick={onClose}>Hủy</Button>
                            <Button onClick={onClose} type="primary" htmlType="submit">
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
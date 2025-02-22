'use client'
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, DatePicker, Drawer, Form, FormProps, Input, Modal, Row, Select, Space } from 'antd';


interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
}

type FieldType = {
    name?: string;
};

const AddAuthor: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        onSubmit(values);
        form.resetFields();
        onClose();
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgMask: 'rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Modal
                    title="Thêm mới tác giả"
                    width={600}
                    footer={null}
                    maskClosable={true}
                    onCancel={onClose}
                    open={open}
                >
                    <Form form={form} name="form-add" onFinish={onFinish} autoComplete="off" layout="vertical">

                        <Form.Item<FieldType>
                            name="name"
                            label="Tên tác giả"
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

export default AddAuthor;

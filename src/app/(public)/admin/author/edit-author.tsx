'use client'

import React, { useEffect } from 'react';
import { Form, Input, Button, ConfigProvider, Modal } from 'antd';
import { ModalEditProps } from './type';



const EditAuthor: React.FC<ModalEditProps> = ({ open, author, onClose, onFinish }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (author) {
            form.setFieldsValue(author);
        }
    }, [author, form]);
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgMask: 'rgba(0,0,0,0.1)',
                },
            }}
        >
            <Modal
                title="Chỉnh sửa tác giả"
                width={600}
                footer={null}
                maskClosable={true}
                onCancel={onClose}
                open={open}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="form-edit"
                    autoComplete="off"
                    layout="vertical"
                    initialValues={author || undefined}
                >
                    <Form.Item
                        name="name"
                        label="Tên tác giả"
                    >
                        <Input />
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

export default EditAuthor;
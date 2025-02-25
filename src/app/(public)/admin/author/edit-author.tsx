'use client'

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, ConfigProvider, Modal, Divider, FormProps, App } from 'antd';

type FieldType = {
    name?: string;
};
interface Author {
    id: string;
    name: string;
}
interface Props {
    openEdit: boolean;
    setOpenEdit: (values: boolean) => void;
    author: Author | null;

}

const EditAuthor = (props: Props) => {
    const { openEdit, setOpenEdit, author } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, modal, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (author) {
            form.setFieldsValue(author);
        }
    }, [author, form]);
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
                title="Chỉnh sửa tác giả"
                width={"40vw"}
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
                    onFinish={onFinish}
                    name="form-edit"
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Tên tác giả"
                        rules={[{ required: true, message: 'Hãy nhập tên tác giả!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>

    );
};

export default EditAuthor;
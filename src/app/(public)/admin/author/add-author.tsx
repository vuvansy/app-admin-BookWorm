'use client'
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Col, ConfigProvider, DatePicker, Divider, Drawer, Form, FormProps, Input, Modal, Row, Select, Space, UploadProps } from 'antd';


interface Props {
    openAdd: boolean;
    setOpenAdd: (values: boolean) => void;
}

type FieldType = {
    name?: string;
};

const AddAuthor = (props: Props) => {
    const { openAdd, setOpenAdd } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, modal, notification } = App.useApp();
    const [form] = Form.useForm();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        message.success('Success!');
        console.log(values);
        setOpenAdd(false);
        form.resetFields();
        setIsSubmit(false);
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
                    width={"40vw"}
                    onOk={() => { form.submit() }}
                    okText={"Tạo mới"}
                    cancelText={"Hủy"}
                    destroyOnClose={true}
                    maskClosable={false}
                    onCancel={() => {
                        form.resetFields();
                        setOpenAdd(false);
                    }}
                    open={openAdd}

                >
                    <Divider />
                    <Form form={form} name="form-add" onFinish={onFinish} autoComplete="off" layout="vertical" >

                        <Form.Item<FieldType>
                            name="name"
                            label="Tên tác giả"
                            rules={[{ required: true, message: 'Hãy nhập tên tác giả!' }]}
                        >
                            <Input />
                        </Form.Item>


                        {/* <div className='flex justify-end gap-x-[15px]'>
                            <Button onClick={onClose}>Hủy</Button>
                            <Button onClick={onClose} type="primary" htmlType="submit">
                                Tạo mới
                            </Button>
                        </div> */}
                    </Form>
                </Modal>
            </ConfigProvider>

        </>
    );
};

export default AddAuthor;

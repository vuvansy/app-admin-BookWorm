'use client'
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Col, ConfigProvider, DatePicker, Divider, Drawer, Form, FormProps, Input, Modal, Row, Select, Space } from 'antd';

const { Option } = Select;

interface Props {
    openAdd: boolean;
    setOpenAdd: (values: boolean) => void;
    setMeta: React.Dispatch<React.SetStateAction<{
        page: number;
        limit: number;
        pages: number;
        total: number;
    }>>;
    onUserAdded?: () => void; // Thêm callback function để thông báo cho component cha
}

type FieldType = {
    role: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    street: string;
    password: string;
    confirm_password: string;
};

const ModalAdd = (props: Props) => {
    const { openAdd, setOpenAdd, setMeta, onUserAdded } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, modal, notification } = App.useApp();
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
            .then(response => response.json())
            .then(data => setCities(data))
            .catch(error => console.error("Lỗi khi fetch dữ liệu:", error));
    }, []);

    const handleCityChange = (cityId: string) => {
        const selectedCity = cities.find(city => city.Id === cityId);
        setDistricts(selectedCity ? selectedCity.Districts : []);
        setWards([]);

        form.setFieldsValue({
            district: undefined,
            ward: undefined
        });
    };

    const handleDistrictChange = (districtId: string) => {
        const selectedDistrict = districts.find(district => district.Id === districtId);
        setWards(selectedDistrict ? selectedDistrict.Wards : []);
        form.setFieldsValue({ ward: undefined });
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        try {
            const selectedCity = cities.find(city => city.Id === values.city);
            const selectedDistrict = districts.find(district => district.Id === values.district);
            const selectedWard = wards.find(ward => ward.Id === values.ward);

            const formattedData = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                password: values.password,
                confirm_password: values.confirm_password,
                role: values.role,
                address: {
                    city: selectedCity ? { key: selectedCity.Id, name: selectedCity.Name } : null,
                    district: selectedDistrict ? { key: selectedDistrict.Id, name: selectedDistrict.Name } : null,
                    ward: selectedWard ? { key: selectedWard.Id, name: selectedWard.Name } : null,
                    street: values.street || "",
                },
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formattedData)
                }
            );

            const data = await res.json();

            if (data.data) {
                message.success('Thêm người dùng thành công');

                // Reset về trang đầu tiên
                setMeta(prev => ({
                    ...prev,
                    page: 1
                }));

                // Gọi callback để thông báo component cha tải lại dữ liệu
                if (onUserAdded) {
                    onUserAdded();
                }

                // Đóng modal và reset form
                form.resetFields();
                setOpenAdd(false);
            } else {
                message.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Đã xảy ra lỗi khi thêm người dùng');
        } finally {
            setIsSubmit(false);
        }
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
                    title="Thêm Mới Người Dùng"
                    width={"70vw"}
                    style={{ top: 20 }}
                    onOk={() => { form.submit() }}
                    okText={"Tạo mới"}
                    cancelText={"Hủy"}
                    destroyOnClose={true}
                    maskClosable={false}
                    confirmLoading={isSubmit}
                    onCancel={() => {
                        form.resetFields();
                        setOpenAdd(false);
                    }}
                    open={openAdd}
                >
                    <Divider />
                    <Form
                        form={form}
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
                                rules={[{ required: true, message: 'Hãy nhập email!' }]}
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
                                rules={[{ required: true, message: 'Hãy chọn ủy quyền!' }]}
                            >
                                <Select
                                    options={[
                                        { value: "ADMIN", label: "Tài Khoản Quản Trị" },
                                        { value: "USER", label: "Tài Khoản Khách Hàng" },
                                    ]}
                                />
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
                                name="confirm_password"
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
                                            name={['city']}
                                            label="Chọn Tỉnh / Thành Phố"
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                placeholder="Chọn Tỉnh/Thành Phố"
                                                options={cities.map(city => ({ value: city.Id, label: city.Name }))}
                                                onChange={handleCityChange}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name={['district']}
                                            label="Chọn Quận / Huyện"
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                placeholder="Chọn Quận/Huyện"
                                                options={districts.map(district => ({ value: district.Id, label: district.Name }))}
                                                onChange={handleDistrictChange}
                                                disabled={!districts.length}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name={['ward']}
                                            label="Chọn Phường / Xã"
                                        >
                                            <Select
                                                placeholder="Chọn Phường/Xã"
                                                showSearch
                                                allowClear
                                                options={wards.map(ward => ({ value: ward.Id, label: ward.Name }))}
                                                disabled={!wards.length}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name={['street']}
                                            label="Nhập Địa Chỉ Cụ Thể"
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
        </>
    );
};

export default ModalAdd;
'use client'

import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Button, ConfigProvider, Modal, Row, Col, Divider, FormProps, App } from 'antd';
import IUserTable from './user-table';
const { Option } = Select;

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
    confirmPassword: string;
};

interface Props {
    openEdit: boolean;
    user: IUserTable | null;
    setOpenEdit: (values: boolean) => void;
    onSuccess?: () => void;
}

const ModalEdit = (props: Props) => {
    const { openEdit, setOpenEdit, user, onSuccess } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, modal, notification } = App.useApp();
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);
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

        if (!isLoadingUserData) {
            form.setFieldsValue({
                district: undefined,
                ward: undefined
            });
        }
    };

    const handleDistrictChange = (districtId: string) => {
        const selectedDistrict = districts.find(district => district.Id === districtId);
        setWards(selectedDistrict ? selectedDistrict.Wards : []);

        if (!isLoadingUserData) {
            form.setFieldsValue({
                ward: undefined
            });
        }
    };

    // Cải thiện quản lý dữ liệu form
    useEffect(() => {
        // Chỉ xử lý khi openEdit = true và user tồn tại
        if (openEdit && user && cities.length > 0) {
            setIsLoadingUserData(true);

            let updatedDistricts: any[] = [];
            let updatedWards: any[] = [];

            // Tìm city và set districts
            if (user.address?.city?.key) {
                const cityId = user.address.city.key;
                const selectedCity = cities.find(city => city.Id === cityId);
                if (selectedCity) {
                    updatedDistricts = selectedCity.Districts;
                    setDistricts(updatedDistricts);

                    // Sau đó load district để kích hoạt wards
                    if (user.address?.district?.key) {
                        const districtId = user.address.district.key;
                        const selectedDistrict = updatedDistricts.find(district => district.Id === districtId);
                        if (selectedDistrict) {
                            updatedWards = selectedDistrict.Wards;
                            setWards(updatedWards);
                        }
                    }
                }
            }

            // Đảm bảo form đã sẵn sàng trước khi setFieldsValue
            setTimeout(() => {
                if (form) {
                    form.setFieldsValue({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        role: user.role || '',
                        password: '',
                        confirmPassword: '',
                        city: user.address?.city?.key || undefined,
                        district: user.address?.district?.key || undefined,
                        ward: user.address?.ward?.key || undefined,
                        street: user.address?.street || ''
                    });
                }
                setIsLoadingUserData(false);
            }, 200); // Tăng thời gian timeout để đảm bảo các giá trị được đặt
        }
    }, [user, openEdit, cities, form]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        const selectedCity = cities.find(city => city.Id === values.city);
        const selectedDistrict = districts.find(district => district.Id === values.district);
        const selectedWard = wards.find(ward => ward.Id === values.ward);
        const formattedData = {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            role: values.role,
            password: values.password || "",
            confirmPassword: values.password || "",
            address: {
                city: selectedCity ? { key: selectedCity.Id, name: selectedCity.Name } : null,
                district: selectedDistrict ? { key: selectedDistrict.Id, name: selectedDistrict.Name } : null,
                ward: selectedWard ? { key: selectedWard.Id, name: selectedWard.Name } : null,
                street: values.street || "",
            },
        };
        console.log("Formatted Data:", formattedData);
        try {
            const data = formattedData
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user/${user?._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            )
            const d = await res.json();
            if (d.data) {
                //success
                message.success("Cập nhật tài khoản thành công.");
                if (onSuccess) {
                    onSuccess();
                }
                setOpenEdit(false);
                form.resetFields();
            } else {
                message.error(d.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmit(false);
        }
    };

    // Reset form khi modal đóng
    const handleCancel = () => {
        form.resetFields();
        setOpenEdit(false);
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
                style={{ top: 20 }}
                onOk={() => { form.submit() }}
                okText={"Cập Nhật"}
                cancelText={"Hủy"}
                destroyOnClose={true}
                maskClosable={true}
                onCancel={handleCancel}
                open={openEdit}
            >
                <Divider />
                <Form
                    form={form}
                    name="form-add"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    preserve={false}
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
                            className='basis-1/2'
                            rules={[{ required: true, message: 'Hãy nhập email!' }]}
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
                            className='basis-1/2'
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        // Không bắt buộc nhập mật khẩu
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="confirmPassword"
                            label="Xác Nhận Mật Khẩu"
                            className='basis-1/2'
                            dependencies={['password']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const password = getFieldValue('password');
                                        // Nếu không có mật khẩu, không cần xác nhận
                                        if (!password) {
                                            return Promise.resolve();
                                        }
                                        // Nếu có mật khẩu nhưng không có xác nhận
                                        if (password && !value) {
                                            return Promise.reject(new Error('Vui lòng xác nhận mật khẩu!'));
                                        }
                                        // Nếu mật khẩu và xác nhận không khớp
                                        if (password && value && password !== value) {
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="city"
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
                                        name="district"
                                        label="Chọn Quận / Huyện"
                                    >
                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Chọn Quận/Huyện"
                                            options={districts.map(district => ({ value: district.Id, label: district.Name }))}
                                            onChange={handleDistrictChange}
                                            disabled={!districts.length} // Vô hiệu hóa nếu chưa chọn tỉnh/thành phố
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="ward"
                                        label="Chọn Phường / Xã"
                                    >
                                        <Select
                                            placeholder="Chọn Phường/Xã"
                                            showSearch
                                            allowClear
                                            options={wards.map(ward => ({ value: ward.Id, label: ward.Name }))}
                                            disabled={!districts.length || !form.getFieldValue('district')} // Vô hiệu hóa nếu chưa chọn quận/huyện
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="street"
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
    );
};

export default ModalEdit;
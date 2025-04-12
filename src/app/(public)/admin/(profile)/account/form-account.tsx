'use client'

import React, { useEffect, useState } from 'react';
import { useCurrentApp } from "@/context/app.context";
import { Button, Checkbox, Col, Form, Input, Row, Select, Image, App, Upload, FormProps } from 'antd';
import { PlusOutlined, ImportOutlined, ExportOutlined, EditTwoTone, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/utils/api';
import useSWR from 'swr';

const { Option } = Select;

type FieldType = {
    fullName: string;
    email: string;
    phone: string;
    city?: string;
    district?: string;
    ward?: string;
    street?: string;
    image: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const AccountForm = () => {
    const { message, modal, notification } = App.useApp();
    const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);
    const [file, setFile] = useState(null);
    const [user, setUser] = useState<IUser>();
    // const [userId, setUserId] = useState<string | undefined>(undefined);
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);
    const [form] = Form.useForm();
    const defaultAvatarUrl = 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'; // URL của ảnh avatar mặc định
    const router = useRouter();
    const { user:CurrentUser } = useCurrentApp();
    const userId = CurrentUser?.id;

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
            .then(response => response.json())
            .then(data => setCities(data))
            .catch(error => console.error("Lỗi khi fetch dữ liệu:", error));
    }, []);

    const handleCityChange = (cityId: string) => {
        const selectedCity = cities.find(city => city.Id === cityId);
        setDistricts(selectedCity ? selectedCity.Districts : []);

        // Reset district và ward nếu không phải đang load dữ liệu
        if (!isLoadingUserData) {
            setSelectedDistrict(undefined);
            form.setFieldsValue({
                district: undefined,
                ward: undefined
            });
        }
    };

    const handleDistrictChange = (districtId: string) => {
        setSelectedDistrict(districtId); // Cập nhật district đã chọn
        const selectedDistrict = districts.find(district => district.Id === districtId);
        setWards(selectedDistrict ? selectedDistrict.Wards : []);

        if (!isLoadingUserData) {
            form.setFieldsValue({
                ward: undefined
            });
        }
    };

    // useEffect(() => {
    //     const fetchUserId = async () => {
    //         try {
    //             setIsLoadingUserData(true);
    //             const Token = localStorage.getItem('access_token');
    //             if (!Token) {
    //                 message.error('Bạn chưa đăng nhập. Vui lòng đăng nhập trước.');
    //                 return;
    //             }
    //             const res = await sendRequest<IBackendRes<IFetchAccount>>({
    //                 url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/account`,
    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `Bearer ${Token}`,
    //                 },
    //             })
    //             if (res.data) {
    //                 setUserId(res.data.user.id);
    //             }
    //         } catch (error) {
    //             if (error instanceof Error) {
    //                 message.error(error.message);
    //             } else {
    //                 message.error('An unknown error occurred.');
    //             }
    //         } finally {
    //             setIsLoadingUserData(false);
    //         }
    //     };
    //     fetchUserId();
    // }, [message]);

    const { data: fetchUserData, isLoading, error } = useSWR(
        userId ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user/${userId}` : null,
        fetcher
    );

    const userData: IUser | null = fetchUserData?.data || null;
    
    useEffect(() => {
        if (userData) {
            setUser(userData);
            setImageUrl(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/avatar/${userData.image}`);
        } else if (error) {
            message.error(error.message || "Không thể tải dữ liệu người dùng");
        }
    }, [userData, error, message]);

    useEffect(() => {
        if (user && cities.length > 0) {
            setIsLoadingUserData(true);

            // Đặt timeout để đảm bảo state đã được cập nhật
            setTimeout(() => {
                // Set city và districts trước
                if (user.address?.city?.key) {
                    const cityId = user.address.city.key;
                    const selectedCity = cities.find(city => city.Id === cityId);
                    if (selectedCity) {
                        setDistricts(selectedCity.Districts);

                        // Set district và wards
                        if (user.address?.district?.key) {
                            const districtId = user.address.district.key;
                            setSelectedDistrict(districtId); // Cập nhật selected district
                            const selectedDistrict = selectedCity.Districts.find(district => district.Id === districtId);
                            if (selectedDistrict) {
                                setWards(selectedDistrict.Wards);
                            }
                        }
                    }
                }

                // Set form values sau khi đã cập nhật districts và wards
                setTimeout(() => {
                    form.setFieldsValue({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        city: user.address?.city?.key || undefined,
                        district: user.address?.district?.key || undefined,
                        ward: user.address?.ward?.key || undefined,
                        street: user.address?.street || ''
                    });
                    setIsLoadingUserData(false);
                }, 300);
            }, 100);
        }
    }, [user, cities, form]);

    const handleUpload = (info: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        setFile(info.file);
        reader.readAsDataURL(info.file);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            const selectedCity = cities.find(city => city.Id === values.city);
            const selectedDistrict = districts.find(district => district.Id === values.district);
            const selectedWard = wards.find(ward => ward.Id === values.ward);
            let imageFileName = "";
            if (file) {
                const formData = new FormData();
                formData.append("fileImg", file);

                const Token = localStorage.getItem('access_token');
                if (!Token) {
                    message.error('Bạn chưa đăng nhập. Vui lòng đăng nhập trước.');
                    return;
                }
                const uploadRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/file/upload`,
                    {
                        method: "POST",
                        headers: {
                            "upload-type": "avatar",
                        },
                        body: formData,
                    });
                // if (uploadRes && uploadRes.data) {
                //     imageFileName = uploadRes.data.filePath;
                // }
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) {
                    throw new Error(uploadData.message);
                }
                imageFileName = uploadData.data.filePath;
            }
            const formattedData = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                address: {
                    city: selectedCity ? { key: selectedCity.Id, name: selectedCity.Name } : null,
                    district: selectedDistrict ? { key: selectedDistrict.Id, name: selectedDistrict.Name } : null,
                    ward: selectedWard ? { key: selectedWard.Id, name: selectedWard.Name } : null,
                    street: values.street || "",
                },
                image: imageFileName,
                password: "",
                confirmPassword: "",
            };
            console.log('formattedData:', formattedData);


            const Token = localStorage.getItem('access_token');
            if (!Token) {
                message.error('Bạn chưa đăng nhập. Vui lòng đăng nhập trước.');
                return;
            }
            const updateRes = await sendRequest<IBackendRes<IUser>>({
                url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user/${userId}`,
                method: "PUT",
                body: formattedData,
            });
            if (updateRes && updateRes.data) {
                message.success('Cập nhật thông tin thành công.');
                setUser(updateRes.data);
                setImageUrl(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/avatar/${updateRes.data.image}`);
            } else {
                message.error(updateRes.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Đã xảy ra lỗi không xác định.');
            }
        }

    }

    return (

        <div className=" bg-white py-7 rounded mt-1 mx-auto">
            <div className=' w-[80vw] mx-auto'>
                <div className=" text-heading3  flex items-center justify-center">Thông Tin Cá Nhân</div>
                <Form
                    name="form-add"
                    className='max-w-[1200px] !pt-5'
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    preserve={false}
                >

                    <div className='flex justify-between'>
                        <div className='basis-1/6 h-60 ml-5 rounded-[10px] border-2 flex align-center justify-center'>
                            <Form.Item
                                name="image"
                            >
                                <div>
                                    <Image src={typeof imageUrl === 'string' ? imageUrl : defaultAvatarUrl} alt="Uploaded" width={130} height={130} className="mt-4 rounded-full"

                                        preview={{
                                            maskClassName: "rounded-full w-[100%] h-[100%] mt-4 ",
                                        }}
                                    />
                                    <div className='flex justify-center mt-[45px] '>
                                        <Upload beforeUpload={() => false} showUploadList={false} onChange={handleUpload}>
                                            <Button>Chọn Ảnh</Button>
                                        </Upload>
                                    </div>
                                </div>
                            </Form.Item>
                        </div>

                        <div className='basis-4/5'>
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
                                >
                                    <Input disabled />
                                </Form.Item>
                            </div>

                            <div className='flex justify-between gap-x-5'>
                                <Form.Item<FieldType>
                                    name="phone"
                                    label="Số Điện Thoại"
                                    rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
                                    className='w-[49%]'
                                >
                                    <Input />
                                </Form.Item>

                            </div>
                            <div className=' flex justify-between gap-x-5'>
                                <Form.Item<FieldType>
                                    name='city'
                                    label="Chọn Tỉnh / Thành Phố"
                                    className='flex-1'
                                >
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder="Chọn Tỉnh/Thành Phố"
                                        options={cities.map(city => ({ value: city.Id, label: city.Name }))}
                                        onChange={handleCityChange}
                                    />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    name='district'
                                    label="Chọn Quận / Huyện"
                                    className='flex-1'
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

                                <Form.Item<FieldType>
                                    name='ward'
                                    label="Chọn Phường / Xã"
                                    className='flex-1'
                                >
                                    <Select
                                        placeholder="Chọn Phường/Xã"
                                        showSearch
                                        allowClear
                                        options={wards.map(ward => ({ value: ward.Id, label: ward.Name }))}
                                        disabled={!selectedDistrict} // Vô hiệu hóa nếu chưa chọn quận/huyện
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name='street'
                                label="Nhập Địa Chỉ Cụ Thể"
                            >
                                <Input />
                            </Form.Item>

                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <Button type="primary" danger htmlType="submit" className='w-[20%]'>Lưu Thay Đổi</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default AccountForm;

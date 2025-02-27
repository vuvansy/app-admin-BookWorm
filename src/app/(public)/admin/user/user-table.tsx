"use client";

import { Table, Button, Input, Space, Drawer, ConfigProvider, Image, Popconfirm, message, Switch } from "antd";
import { PlusOutlined, ImportOutlined, ExportOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import type { PopconfirmProps } from 'antd';
import { useState } from "react";
import ModalProfile from "./modal-profile";
import ModalEdit from "./modal-edit";
import ModalAdd from "./modal-add";

export interface Address {
    city: string;
    district: string;
    ward: string;
    specific_address: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    image: string;
    password: string;
    address: Address;
    createdAt: string;
    updatedAt: string;
}

const data: User[] = [
    {
        id: "67441ccbdrcaffdsfsdf07",
        fullName: "vovankhang",
        email: "khang124@gmail.com",
        phone: "0123456789",
        role: "ADMIN",
        image: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        password: "123456",
        address: {
            city: "Hồ Chí Minh",
            district: "12",
            ward: "Thạnh Lộc",
            specific_address: "Khu 1"
        },
        createdAt: "25-11-2022",
        updatedAt: "25-11-2025",
    },
    {
        id: "67441ccbdrcaffdsfsdf08",
        fullName: "vovankhang",
        email: "khang124@gmail.com",
        phone: "0123456789",
        role: "USER",
        image: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        password: "123456",
        address: {
            city: "Hồ Chí Minh",
            district: "12",
            ward: "Thạnh Lộc",
            specific_address: "Khu 2"
        },
        createdAt: "25-11-2025",
        updatedAt: "25-11-2025",
    },
    {
        id: "67441ccbdrcaffdsfsdf09",
        fullName: "vovankhang",
        email: "khang124@gmail.com",
        phone: "0123456789",
        role: "USER",
        image: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        password: "123456",
        address: {
            city: "Hồ Chí Minh",
            district: "12",
            ward: "Thạnh Lộc",
            specific_address: "Khu 3"
        },
        createdAt: "25-11-2024",
        updatedAt: "25-11-2025",
    },
    {
        id: "67441ccbdrcaffdsfsdf01",
        fullName: "vovankhang",
        email: "khang124@gmail.com",
        phone: "0123456789",
        role: "ADMIN",
        image: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        password: "123456",
        address: {
            city: "Hồ Chí Minh",
            district: "12",
            ward: "Thạnh Lộc",
            specific_address: "Khu 4"
        },
        createdAt: "25-11-2021",
        updatedAt: "25-11-2025",
    },
    {
        id: "67441ccbdrcaffdsfsdf02",
        fullName: "vovankhang",
        email: "khang124@gmail.com",
        phone: "0123456789",
        role: "USER",
        image: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        password: "123456",
        address: {
            city: "Hồ Chí Minh",
            district: "12",
            ward: "Thạnh Lộc",
            specific_address: "Khu 5"
        },
        createdAt: "25-11-2026",
        updatedAt: "25-11-2025",
    },
    {
        id: "67441ccbdrcaffdsfsdf03",
        fullName: "vovankhang",
        email: "khang124@gmail.com",
        phone: "0123456789",
        role: "ADMIN",
        image: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        password: "123456",
        address: {
            city: "Hồ Chí Minh",
            district: "12",
            ward: "Thạnh Lộc",
            specific_address: "Khu 6"
        },
        createdAt: "25-11-2023",
        updatedAt: "25-11-2025",
    },
    {
        id: "67441ccbdrcaffdsfsdf04",
        fullName: "vovankhang",
        email: "khang124@gmail.com",
        phone: "0123456789",
        role: "ADMIN",
        image: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        password: "123456",
        address: {
            city: "Hồ Chí Minh",
            district: "12",
            ward: "Thạnh Lộc",
            specific_address: "Khu 7"
        },
        createdAt: "25-11-2020",
        updatedAt: "25-11-2025",
    },
];

const UserTable = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const showDrawer = (user: User) => {
        setSelectedUser(user);
        setOpenProfile(true);
    };
    const showEdit = (user: User) => {
        setSelectedUser(user);
        setOpenEdit(true);
    };

    const onClose = () => {
        setOpenProfile(false);
        setSelectedUser(null);
    };
    const confirm: PopconfirmProps['onConfirm'] = (e) => {
        console.log(e);
        message.success('Click on Yes');
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('Click on No');
    };
    const onChange = (checked: boolean, id: string) => {
        console.log(`ID: ${id} - Checked: ${checked}`);
        // Lấy giá trị checked và id của user 
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text: string, record: User) => <div>
                <a className="text-blue-500" onClick={() => showDrawer(record)}>{text}</a>
            </div>,
        },
        {
            title: 'Tên Người Dùng',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Ủy Quyền',
            dataIndex: 'role',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            sorter: (a: User, b: User) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: 'Khóa',
            render: (_: any, record: User) => (
                <Switch defaultChecked={true} onChange={(checked) => onChange(checked, record.id)} />
            ),
        },
        {
            title: 'Thao Tác',
            align: 'center' as 'center',
            render: (_: any, record: User) => (
                <EditTwoTone twoToneColor={'#f57800'} onClick={() => showEdit(record)} className="px-[10px]" />

            ),
        },
    ];

    return (
        <>
            <div className="mt-5 bg-white rounded px-5">
                <div className="flex justify-between items-center">
                    <div className="text-body-bold leading-[60px] bg-white rounded uppercase">
                        Quản lý người dùng
                    </div>
                    <div className=" flex space-x-2 items-center">
                        <Button icon={<ExportOutlined />} type="primary">Export</Button>
                        <Button icon={<ImportOutlined />} type="primary">Import</Button>
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenAdd(true)}>Thêm mới</Button>

                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 5 }}
                    rowKey="id"
                    size="small"
                />
                <ModalProfile open={openProfile} user={selectedUser} onClose={onClose} />
                <ModalAdd openAdd={openAdd} setOpenAdd={setOpenAdd} />
                <ModalEdit openEdit={openEdit} user={selectedUser} setOpenEdit={setOpenEdit} />
            </div>
        </>
    );
};

export default UserTable;

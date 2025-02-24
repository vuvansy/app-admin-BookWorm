"use client";

import { Table, Button, Input, Space, Drawer, ConfigProvider, Image, Popconfirm, message, Switch } from "antd";
import { PlusOutlined, ImportOutlined, ExportOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import type { PopconfirmProps } from 'antd';
import { useState } from "react";
import ModalProfile from "./modal-profile";
import ModalEdit from "./modal-edit";

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

const UserTable = ({ data }: { data: User[] }) => {
    const [openProfile, setOpenProfile] = useState(false);
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
    const onCloseEdit = () => {
        setOpenEdit(false);
        setSelectedUser(null);
    };
    const onFinishEdit = (values: User) => {
        console.log('Edited values:', values);
        // Trả về giá trị sau khi chỉnh sửa
        onCloseEdit();
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
            render: (_: any, record: User) => (
                <Space size="middle">
                    {<EditTwoTone twoToneColor={'#f57800'} onClick={() => showEdit(record)} className="px-[10px]" />}

                    <Popconfirm
                        placement="leftTop"
                        title="Delete the task"
                        description="Bạn có chắc chắn muốn xóa người dùng này không?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <span className="cursor-pointer">{<DeleteTwoTone twoToneColor={'#ff4d4f'} />}</span>
                    </Popconfirm>

                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                rowKey="id" />
            <ModalProfile open={openProfile} user={selectedUser} onClose={onClose} />
            <ModalEdit open={openEdit} user={selectedUser} onClose={onCloseEdit} onFinish={onFinishEdit} />
        </>
    );
};

export default UserTable;

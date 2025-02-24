

import React from "react";
import UserTable from "./user-table";
import { Button, Input } from "antd";
import { PlusOutlined, ImportOutlined, ExportOutlined } from "@ant-design/icons";
import FilterForm from "./form-filter";
import ModalAdd from "./modal-add";


const data = [
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

const UsersPage = () => {

    return (
        <div>
            <div className="px-5 pt-5 bg-white rounded-lg">
                <div className="">
                    <FilterForm />
                </div>
            </div>
            <div className="mt-5 bg-white rounded-lg px-5">
                <div className="flex justify-between items-center">
                    <div className="text-body-bold leading-[60px] bg-white rounded-lg uppercase">
                        Quản lý người dùng
                    </div>
                    <div className=" flex space-x-2 items-center">
                        <Button icon={<ExportOutlined />} type="primary">Export</Button>
                        <Button icon={<ImportOutlined />} type="primary">Import</Button>
                        <ModalAdd />
                    </div>
                </div>
                <UserTable data={data} />
            </div>
        </div>
    );
}

export default UsersPage
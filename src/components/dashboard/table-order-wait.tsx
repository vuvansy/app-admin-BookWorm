"use client"

import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import type { TableProps } from 'antd';
import { BsEyeFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { Table } from 'antd';
import Link from "next/link";

interface DataType {
    key: string;
    name: string;
    date: string;
    cart: string;
    status: string;
}

const data: DataType[] = [
    {
        key: '1',
        name: 'Vũ Văn Sỹ',
        date: "21:00:02 10-04-2025",
        cart: '2 sản phẩm',
        status: "Chờ xác nhận",
    },
    {
        key: '2',
        name: 'Võ Văn Khang',
        date: "21:00:02 10-04-2025",
        cart: '2 sản phẩm',
        status: "Chờ xác nhận",
    },
    {
        key: '3',
        name: 'Tạ Văn Tuấn',
        date: "21:00:02 10-04-2025",
        cart: '5 sản phẩm',
        status: "Chờ xác nhận",
    },
];

const TableOrderWait = () => {

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Khách Hàng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngày Đặt Hàng',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Giỏ Hàng',
            dataIndex: 'cart',
            key: 'cart',
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => (
                <span className="bg-[#0D63D6] text-white px-3 py-1 rounded-md font-medium">
                    {status}
                </span>
            ),
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link href="/admin/order/1" className="px-3 py-[6px] bg-[#D84040] cursor-pointer rounded-lg">
                        <BsEyeFill className="text-white text-[16px]" />
                    </Link>
                    <button className="px-3 py-[6px] bg-[#0D63D6] cursor-pointer rounded-lg">
                        <FaCheck className="text-white text-[16px]" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="rounded border bg-white px-[15px] py-[10px] mb-[20px]">
            <h2 className="text-body-bold pb-[10px]">Đơn Hàng Cần Xác Nhận</h2>
            <Table<DataType>
                columns={columns}
                dataSource={data}
                pagination={false}
                size="small"
            />
            <div className="mt-2 pl-2">
                <Link href="/admin/order" className="text-caption-bold">Xem tất cả đơn hàng <ArrowRightOutlined style={{ fontSize: "13px" }} /></Link>
            </div>
        </div>
    )
}

export default TableOrderWait
"use client"

import { useState } from "react";
import { Table, Tabs, TableProps, Empty } from 'antd';
import { BsEyeFill } from "react-icons/bs";
import Link from "next/link";

interface DataType {
    id: string;
    fullName: string;
    quantity: number;
    total: number;
    status: number;
    date: string;

}
const columns: TableProps<DataType>['columns'] = [
    {
        title: "STT",
        render: (_, record, index) => {
            return <>{index + 1}</>;
        },
    },

    {
        title: 'Mã Đơn Hàng',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Khach Hàng',
        dataIndex: 'fullName',
        key: 'fullName',
    },
    {
        title: 'Số Lượng',
        key: 'quantity',
        dataIndex: 'quantity',
        align: "center",

    },
    {
        title: 'Tổng Tiền',
        key: 'total',
        dataIndex: 'total',
        align: "center",
        render: (total) => (
            <div className="text-center leading-none">
                {new Intl.NumberFormat('vi-VN').format(total)} đ
            </div>
        ),
    },
    {
        title: 'Trạng Thái',
        key: 'status',
        dataIndex: 'status',
        align: "center",
        render: (status) => {
            const statusColors = {
                0: { label: 'Chờ xác nhận', color: 'bg-yellow-500' },
                1: { label: 'Đã xác nhận', color: 'bg-blue-500' },
                2: { label: 'Đang vận chuyển', color: 'bg-[#2db7f5]' },
                3: { label: 'Đã giao hàng', color: 'bg-green-500' },
                4: { label: 'Đã hủy', color: 'bg-red-500' }
            } as const;
            const { label, color } = statusColors[status as keyof typeof statusColors] || { label: 'Không xác định', color: 'bg-gray-500' };
            return (
                <span className={`${color} text-white px-2 py-[2px] rounded-md font-medium`}>
                    {label}
                </span>
            );
        },
    },
    {
        title: 'Thời Gian',
        key: 'date',
        dataIndex: 'date',
    },
    {
        title: 'Thao Tác',
        key: 'action',
        render: (_, record) => (
            <div style={{ display: "flex", gap: "10px" }}>
                <Link href="/admin/order/1" className="px-3 py-[6px] bg-[#D84040] cursor-pointer rounded-lg">
                    <BsEyeFill className="text-white text-[16px]" />
                </Link>
            </div>
        ),
    },
];

const TableOrders = () => {

    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

    const items = [
        {
            key: "sort=-sold",
            label: `Tất cả(20)`,
            children: <></>,
        },
        {
            key: 'sort=0',
            label: `Chờ xác nhận(10)`,
            children: <></>,
        },
        {
            key: 'sort=1',
            label: `Đã xác nhận(5)`,
            children: <></>,
        },
        {
            key: 'sort=2',
            label: `Đang vận chuyển(2)`,
            children: <></>,
        },
        {
            key: 'sort=3',
            label: `Đã giao hàng(15)`,
            children: <></>,
        },
        {
            key: 'sort=4',
            label: `Đã hủy(1)`,
            children: <></>,
        },
    ];

    const data: DataType[] = [
        {
            id: '67af11e06e65f61d9f0e5900',
            fullName: 'Vũ Trần Nhật Quỳnh',
            quantity: 1,
            total: 3000000,
            status: 3,
            date: '22:00:00 20-2-2025'
        },
        {
            id: '67af11e06e65f61d9f0e5901',
            fullName: 'Vũ Trần Nhật Quỳnh',
            quantity: 1,
            total: 3000000,
            status: 0,
            date: '22:00:00 20-2-2025'
        },
        {
            id: '67af11e06e65f61d9f0e5902',
            fullName: 'Vũ Trần Nhật Quỳnh',
            quantity: 1,
            total: 3000000,
            status: 2,
            date: '22:00:00 20-2-2025'
        },
        {
            id: '67af11e06e65f61d9f0e5903',
            fullName: 'Vũ Trần Nhật Quỳnh',
            quantity: 1,
            total: 3000000,
            status: 4,
            date: '22:00:00 20-2-2025'
        },
        {
            id: '67af11e06e65f61d9f0e5904',
            fullName: 'Vũ Trần Nhật Quỳnh',
            quantity: 1,
            total: 3000000,
            status: 1,
            date: '22:00:00 20-2-2025'
        },

    ];

    return (
        <>
            <Tabs
                defaultActiveKey="sort=-sold"
                items={items}
                onChange={(value) => { setSortQuery(value) }}
                style={{ overflowX: "auto" }}
            />
            <Table<DataType>
                columns={columns}
                dataSource={data}
                rowKey={"id"}
                size="small"
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có đơn hàng nào!" />
                }}
            />
        </>
    )
}

export default TableOrders
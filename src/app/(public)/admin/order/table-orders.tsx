"use client"

import { useEffect, useMemo, useState } from "react";
import { Table, Tabs, TableProps, Empty, Spin } from 'antd';
import { BsEyeFill } from "react-icons/bs";
import Link from "next/link";
import useSWR from "swr";
import { sendRequest } from "@/utils/api";
import dayjs from "dayjs";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
    fetch(...args).then((res) => res.json());


const TableOrders = () => {

    const [meta, setMeta] = useState({
        page: 1,
        limit: 10,
        pages: 0,
        total: 0
    });
    const [sortQuery, setSortQuery] = useState<string>("createdAt");
    const [status, setStatus] = useState<string | undefined>("0");

    const params = new URLSearchParams({
        page: meta.page.toString(),
        limit: meta.limit.toString(),
        ...(status ? { status } : {}),
        ...(sortQuery ? { sort: sortQuery } : {})
    }).toString();
    const queryString = params ? `?${params}` : "";

    const { data: orderData, error: orderError, isLoading: orderLoading } = useSWR<IBackendRes<IModelPaginate<IHistory>>>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order${queryString}`,
        fetcher
    );

    const orders = orderData?.data?.result;
    const statusCounts = orderData?.data?.meta?.statusCounts || {
        "": 0,
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
    };

    if (orderLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Spin size="large">
                    <span className="text-gray-600">Loading...</span>
                </Spin>
            </div>
        );
    };
    if (orderError) return <p>Có lỗi xảy ra khi tải dữ liệu!</p>;

    const items = [
        { key: "", label: `Tất cả (${statusCounts[""] || 0})` },
        { key: "0", label: `Chờ xác nhận (${statusCounts["0"] || 0})` },
        { key: "1", label: `Đã xác nhận (${statusCounts["1"] || 0})` },
        { key: "2", label: `Đang vận chuyển (${statusCounts["2"] || 0})` },
        { key: "3", label: `Đã giao hàng (${statusCounts["3"] || 0})` },
        { key: "4", label: `Đã hủy (${statusCounts["4"] || 0})` }
    ];

    const columns: TableProps<IHistory>['columns'] = [
        {
            title: "STT",
            dataIndex: 'stt',
            align: 'center' as 'center',
            render: (_, record, index) => {
                return <>{index + 1 + (meta.page - 1) * meta.limit}</>;
            },
        },

        {
            title: 'Mã Đơn Hàng',
            dataIndex: '_id',
            key: 'id',
        },
        {
            title: 'Khách Hàng',
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
            dataIndex: 'order_total',
            align: "center",
            render: (order_total) => (
                <div className="text-center leading-none">
                    {new Intl.NumberFormat('vi-VN').format(order_total)} đ
                </div>
            ),
        },
        {
            title: 'Thanh Toán',
            key: 'isPaid',
            dataIndex: 'isPaid',
            align: "center",
            render: (isPaid) => (
                <div className="text-center leading-none">
                    {isPaid ? "✅ Đã thanh toán" : "⏳Chưa thanh toán"}
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
            sorter: false,
            dataIndex: 'createdAt',
            render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            title: 'Thao Tác',
            key: 'action',
            align: 'center' as 'center',
            render: (_, record) => (
                <div className="flex justify-center">
                    <Link href={`/admin/order/${record._id}`} className="px-3 py-[6px] bg-[#2F80ED] cursor-pointer rounded-lg">
                        <BsEyeFill className="text-white text-[16px]" />
                    </Link>
                </div>
            ),
        },
    ];
    return (
        <>
            <Tabs
                activeKey={status ?? "0"}
                items={items}
                onChange={(value) => {
                    setStatus(value);
                    setMeta((prev) => ({ ...prev, page: 1 }));
                }}
            />
            <Table<IHistory>
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                size="small"
                pagination={
                    {
                        current: meta.page,
                        pageSize: meta.limit,
                        showSizeChanger: true,
                        total: orderData?.data?.meta.total,

                        showTotal: (total, range) => (
                            <div> {range[0]}-{range[1]} trên {total} rows</div>
                        ),
                        onChange: (page, limit) => {
                            console.log(`Chuyển sang trang ${page}, limit: ${limit}`);
                            setMeta({ ...meta, page: page, limit });
                        }
                    }
                }

                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có đơn hàng nào!" />
                }}
            />
        </>
    )
}

export default TableOrders
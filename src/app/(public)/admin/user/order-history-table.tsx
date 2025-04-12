"use client"

import { useCurrentApp } from "@/context/app.context";
import { sendRequest } from "@/utils/api";
import { Empty, Spin, Tabs } from "antd";
import dayjs from "dayjs";
import Link from "next/link"
import { useState } from "react";
import useSWR from "swr";

interface UserIdProps {
    userId: string | null;
}

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

const OrderHistoryTable: React.FC<UserIdProps> = ({userId}) => {
    const [status, setStatus] = useState<string | undefined>(undefined);
    
    const url = userId
        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order/${userId}${status ? `?status=${status}` : ""}`
        : null;
    const { data: listOrder, error, isLoading } = useSWR<IBackendRes<IModelPaginate<IHistory>>>(
        url,
        fetcher
    );

    const orders = listOrder?.data?.result;
    const statusCounts = listOrder?.data?.meta?.statusCounts || {
        "": 0,
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Spin size="large">
                    <span className="text-gray-600">Loading...</span>
                </Spin>
            </div>
        );
    }
    if (error) {
        return <div className="text-red-500 text-center py-4">Lỗi khi lấy dữ liệu đơn hàng!</div>;
    }

    const orderStatusMap: Record<number, string> = {
        0: "Chờ Xác Nhận",
        1: "Đã Xác Nhận",
        2: "Đang Vận Chuyển",
        3: "Đã Giao Hàng",
        4: "Đã hủy"
    };
    const getStatusLabel = (status: number) => orderStatusMap[status] || "Không xác định";
    const items = [
        { key: "", label: `Tất cả (${statusCounts[""] || 0})` },
        { key: "0", label: `Chờ xác nhận (${statusCounts["0"] || 0})` },
        { key: "1", label: `Đã xác nhận (${statusCounts["1"] || 0})` },
        { key: "2", label: `Đang vận chuyển (${statusCounts["2"] || 0})` },
        { key: "3", label: `Đã giao hàng (${statusCounts["3"] || 0})` },
        { key: "4", label: `Đã hủy (${statusCounts["4"] || 0})` }
    ];
    return (
        <>
            <div className="pb-[20px] px-[10px]">
                <Tabs
                    activeKey={status ?? ""}
                    items={items}
                    onChange={(value) => {
                        setStatus(value || undefined);
                    }}
                />
                {orders && orders.length > 0 ? (
                    <table className="table-auto border-collapse w-full text-[15px]">
                        <thead>
                            <tr>
                                <th className="p-[10px] text-left">Mã Đơn Hàng</th>
                                <th className="p-[10px] text-left">Ngày Đặt Hàng</th>
                                <th className="p-[10px]">Tổng Tiền</th>
                                <th className="p-[10px]">Hình thức thanh toán</th>
                                <th className="p-[10px]">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-y odd:bg-gray-100 even:bg-white text-caption">
                                    <td className="p-[10px] border-b border-solid border-[#ddd]">{order._id}</td>
                                    <td className="p-[10px] text-left border-b border-solid border-[#ddd]">
                                        {dayjs(order?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                                    </td>
                                    <td className="p-[10px] text-center text-price-special font-semibold border-b border-solid border-[#ddd]">
                                        {new Intl.NumberFormat("vi-VN").format(order.order_total + order.shippingPrice)} đ
                                    </td>
                                    <td className="p-[10px] text-center border-b border-solid border-[#ddd]">
                                        {order.id_payment?.name || "Không xác định"}
                                    </td>
                                    <td className="p-[10px] text-center border-b border-solid border-[#ddd]">
                                        {getStatusLabel(order.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex justify-center py-6">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<span>Chưa có đơn hàng nào để hiển thị</span>}
                        />
                    </div>
                )}
            </div>
        </>

    )
}

export default OrderHistoryTable
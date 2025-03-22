"use client"

import { ArrowRightOutlined } from "@ant-design/icons";
import { TableProps, Empty, Table, Spin, App } from 'antd';
import { BsEyeFill } from "react-icons/bs";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';

import useSWR, { mutate } from "swr";
import { sendRequest } from "@/utils/api";
import dayjs from "dayjs";
import Image from "next/image";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
    fetch(...args).then((res) => res.json());



const TableOrderWait = () => {
    const [meta, setMeta] = useState({
        page: 1,
        limit: 5,
        pages: 0,
        total: 0
    });
    const { message } = App.useApp();

    const [sortQuery, setSortQuery] = useState<string>("createdAt");
    const [status, setStatus] = useState<string | undefined>("0");
    const [open, setOpen] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState<IHistory | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);


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

    // Lấy chi tiết đơn hàng
    const { data: orderDetailData, error: orderDetailError, isLoading: orderDetailLoading } = useSWR<IBackendRes<IOrderDetailTable[]>>(
        selectedOrderId ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order-detail/${selectedOrderId}` : null,
        fetcher
    );

    const orderDetails = orderDetailData?.data;

    if (orderLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Spin size="large">
                    <span className="text-gray-600">Loading...</span>
                </Spin>
            </div>
        );
    };
    if (orderError) return <p>Có lỗi xảy ra khi tải dữ liệu!</p>;

    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'Mã Đơn Hàng',
            dataIndex: '_id',
            key: 'id',
        },
        {
            title: 'Khach Hàng',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Ngày Đặt Hàng',
            key: 'date',
            dataIndex: 'createdAt',
            render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            title: 'Giỏ Hàng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: "center",
            render: (quantity) => {
                return (
                    <span className="px-2 py-[2px] rounded-md font-medium">
                        {quantity} Sản Phẩm
                    </span>
                );
            },
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
            title: 'Thao Tác',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => handleOpenModal(record)}
                        className="px-3 py-[6px] bg-[#D84040] cursor-pointer rounded-lg">
                        <BsEyeFill className="text-white text-[16px]" />
                    </button>
                </div>
            ),
        },
    ];

    const columnsOrder: TableProps<IOrderDetailTable>['columns'] = [
        {
            title: 'Ảnh',
            dataIndex: 'id_book',
            key: 'image',
            align: "center",
            render: (id_book) => (
                <div className="flex justify-center">
                    <div className="relative w-[80px] h-[80px]">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${id_book.image}`}
                            alt={id_book.name}
                            className="object-cover" fill />
                    </div>
                </div>
            ),
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'id_book',
            key: 'name',
            render: (id_book) => (
                <div className="w-[400px]">
                    <p>{id_book.name}</p>
                </div>
            ),
        },
        {
            title: 'Giá Sản Phẩm',
            dataIndex: 'price',
            key: 'price',
            align: "center",
            render: (price) => (
                <div className="text-center leading-none">
                    {new Intl.NumberFormat('vi-VN').format(price)} đ
                </div>
            ),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: "center",
        },
        {
            title: 'Thành Tiền',
            dataIndex: 'total',
            key: 'total',
            align: "center",
            render: (_, record) => {
                const computedTotal = Number(record.price) * Number(record.quantity);
                return (
                    <div className="text-center leading-none">
                        {new Intl.NumberFormat('vi-VN').format(computedTotal)} đ
                    </div>
                );
            },
        },
    ];


    const handleOpenModal = (order: IHistory) => {
        setSelectedOrderId(order._id);
        setSelectedOrder(order);
        setOpen(true);
    };

    const handleConfirmOrder = async () => {
        if (!selectedOrder?._id) return;

        try {
            const res = await sendRequest<IBackendRes<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order/update-status/${selectedOrder._id}`,
                method: "PUT",
                body: { status: 1 },
            });

            if (res.statusCode === 200) {
                message.success("Đơn hàng đã được xác nhận!");
                mutate(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order${queryString}`);
                setOpen(false);
            } else {
                message.error(res.message || "Xác nhận đơn hàng thất bại!");
            }
        } catch (error) {
            message.error("Lỗi khi xác nhận đơn hàng!");
        }
    };


    const handleCloseModal = () => {
        setOpen(false);
        setSelectedOrder(null);
    };

    const orderStatusMap: Record<number, string> = {
        0: "Chờ Xác Nhận",
        1: "Đã Xác Nhận",
        2: "Đang Vận Chuyển",
        3: "Đã Giao Hàng",
        4: "Đã hủy"
    };
    const getStatusColor = (status: number | undefined) => {
        switch (status) {
            case 1: return "bg-blue-500";
            case 2: return "bg-[#2db7f5]";
            case 3: return "bg-green-500";
            case 4: return "bg-red-500";
            default: return "bg-yellow-500";
        }
    };
    const getStatusLabel = (status: number) => orderStatusMap[status] || "Không xác định";
    const address = typeof selectedOrder?.address === "string" ? JSON.parse(selectedOrder.address) : selectedOrder?.address;
    return (
        <>
            <div className="rounded border bg-white px-[15px] py-[10px] mb-[20px]">
                <h2 className="text-body-bold pb-[10px]">Đơn Hàng Cần Xác Nhận</h2>
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
                        emptyText: <Empty style={{ maxHeight: "36px" }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có đơn hàng nào cần xác nhận" />
                    }}
                />
            </div>
            <Modal
                open={open}
                onOk={handleConfirmOrder}
                onCancel={handleCloseModal}
                okText={"Xác nhận đơn hàng"}
                cancelText={"Hủy"}
                style={{ top: 20 }}
                width={1000}
            >
                <div className="">
                    <div className="flex justify-between pb-[10px]">
                        <h2 className="text-body1 uppercase font-semibold">Thông tin đơn hàng</h2>
                        <div className="flex gap-[8px] pr-[30px]">
                            <p className="font-semibold">{selectedOrder?._id}</p>
                            <p className={`px-3 ${getStatusColor(selectedOrder?.status)} text-white font-semibold rounded`}>
                                {getStatusLabel(selectedOrder?.status as number)}
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="flex justify-between my-[10px]">
                        <div className="">
                            <h3 className="font-semibold text-body1 pb-1">Thông Tin Khách Hàng</h3>
                            <p className='pb-1'>Tên: {selectedOrder?.fullName}</p>
                            <p className='pb-1'>Địa chỉ: {`${address?.street}, ${address?.ward?.name}, ${address?.district?.name}, ${address?.city?.name}`}</p>
                            <p className='pb-1'>SĐT: {selectedOrder?.phone}</p>
                            <p className='pb-1'>Email: {selectedOrder?.email}</p>
                        </div>
                        <div>
                            <div className="mb-2 text-right">
                                <h3 className="font-semibold text-body1">Phương Thức Thanh Toán</h3>
                                <p className="capitalize">{selectedOrder?.id_payment.name}</p>
                            </div>
                            <div className="mb-2 text-right">
                                <h3 className="font-semibold text-body1">Phương Thức Vận Chuyển</h3>
                                <p className="capitalize">{selectedOrder?.id_delivery.name}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-body1">Ngày Đặt Hàng</h3>
                                <p>{dayjs(selectedOrder?.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="py-[10px] mb-[20px]">
                            <h2 className="text-body-bold pb-[10px]">Thông tin sản phẩm</h2>
                            <Table<IOrderDetailTable>
                                columns={columnsOrder}
                                dataSource={orderDetails}
                                rowKey="_id"
                                pagination={false}
                                size="small"
                                locale={{
                                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có đơn hàng nào cần xác nhận" />
                                }}
                            />

                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default TableOrderWait
"use client"

import { ArrowRightOutlined} from "@ant-design/icons";
import { TableProps, Empty, Table} from 'antd';
import { BsEyeFill } from "react-icons/bs";
import Link from "next/link";
import React, { useState } from 'react';
import { Modal } from 'antd';

interface DataType {
    key: string;
    name: string;
    date: string;
    cart: string;
    status: string;
}
interface DataTypeOrder {
    key: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
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
const dataOrder: DataTypeOrder[] = [
    {
        key: '1',
        name: 'Tuyển Tập Akira Toriyama - Phim Trường Akira Toriyama - Tập 2 (Tái Bản 2024)',
        image: "/books/sachlichsu.webp",
        price: 10000,
        quantity: 2,
        total: 200000,
    },
    {
        key: '2',
        name: 'Hoàng Tử Bé (Song Ngữ Việt-Anh)',
        image: "/books/sachtienganh.jpeg",
        price: 10000,
        quantity: 2,
        total: 200000,
    },
    {
        key: '2',
        name: 'Hoàng Tử Bé (Song Ngữ Việt-Anh)',
        image: "/books/sachvanhoa.png",
        price: 10000,
        quantity: 2,
        total: 200000,
    },

];

const TableOrderWait = () => {
    const [open, setOpen] = useState(false);

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
                    <button onClick={() => setOpen(true)} className="px-3 py-[6px] bg-[#D84040] cursor-pointer rounded-lg">
                        <BsEyeFill className="text-white text-[16px]" />
                    </button>
                </div>
            ),
        },
    ];

    const columnsOrder: TableProps<DataTypeOrder>['columns'] = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            align: "center",
            render: (image) => (
                <div className="flex justify-center">
                    <img src={image} className="w-[80px] h-[80px]" />
                </div>
            ),
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <div className="w-[400px]">
                    <p>{name}</p>
                </div>
            ),
        },
        {
            title: 'Giá sản phẩm',
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
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: "center",
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            key: 'total',
            align: "center",
            render: (total) => (
                <div className="text-center leading-none">
                    {new Intl.NumberFormat('vi-VN').format(total)} đ
                </div>
            ),

        },

    ];

    return (
        <>
            <div className="rounded border bg-white px-[15px] py-[10px] mb-[20px]">
                <h2 className="text-body-bold pb-[10px]">Đơn Hàng Cần Xác Nhận</h2>
                <Table<DataType>
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    size="small"
                    locale={{
                        emptyText: <Empty style={{ maxHeight: "36px" }}  image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có đơn hàng nào cần xác nhận" />
                    }}
                />
                <div className="mt-2 pl-2">
                    <Link href="/admin/order" className="text-caption-bold">Xem tất cả đơn hàng <ArrowRightOutlined style={{ fontSize: "13px" }} /></Link>
                </div>
            </div>
            <Modal
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                okText={"Xác nhận đơn hàng"}
                cancelText={"Hủy"}
                style={{ top: 20 }}
                width={1000}
            >
                <div className="">
                    <div className="flex justify-between pb-[10px]">
                        <h2 className="text-body1 uppercase font-semibold">Thông tin đơn hàng</h2>
                        <div className="flex gap-[8px] pr-[30px]">
                            <p className="font-semibold">67af11e06e65f61d9f0e5900</p>
                            <p className="px-3 bg-yellow-1 text-white font-semibold rounded">Chờ xác nhận</p>
                        </div>
                    </div>
                    <hr />
                    <div className="flex justify-between my-[10px]">
                        <div className="">
                            <h3 className="font-semibold text-body1 pb-1">Thông Tin Khách Hàng</h3>
                            <p>Tên: Võ Văn khang</p>
                            <p>Địa chỉ: 72N đường HT05, HP24, Phường Hiệp Thành, Quận 12, Thành Phố Hồ Chí Minh</p>
                            <p>SĐT: 0828937376</p>
                            <p>Email: khangvvps26357.fpt.edu.vn</p>
                        </div>
                        <div>
                            <div className="mb-2">
                                <h3 className="font-semibold text-body1">Phương Thức Thanh Toán</h3>
                                <p className="text-right capitalize">Thanh toán khi nhận hàng</p>
                            </div>
                            <div className="mb-2">
                                <h3 className="font-semibold text-body1">Phương Thức Vận Chuyển</h3>
                                <p className="text-right capitalize">giao hàng tiết kiệm</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-body1">Ngày Đặt Hàng</h3>
                                <p>31:00:00 20-2-2025</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="py-[10px] mb-[20px]">
                            <h2 className="text-body-bold pb-[10px]">Thông tin sản phẩm</h2>
                            <Table<DataTypeOrder>
                                columns={columnsOrder}
                                dataSource={dataOrder}
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
"use client"

import { Button } from 'antd';
import { Popconfirm, Space, Table, } from 'antd';
import type { TableProps } from 'antd';
import Image from 'next/image';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

import CreateBanner from './add-banner';
import UpdateBanner from './edit-banner';

interface DataType {
    key: string;
    image: string;
    name: string;
    status: number;
    date: string;
}

const data: DataType[] = [
    {
        key: "1",
        name: 'Banner Book new',
        image: "/banner/banner1.webp",
        status: 1,
        date: "13:00:00 22-2-2025",
    },
    {
        key: "2",
        name: 'Banner Book sale 30%',
        image: "/banner/banner1.webp",
        status: 0,
        date: "13:00:00 22-2-2025",
    },
]



const TableBanner = () => {

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

    const columns: TableProps<DataType>['columns'] = [
        {
            title: "STT",
            align: "center",
            render: (_, record, index) => {
                return <>{index + 1}</>;
            },
        },
        {
            title: 'Hình Ảnh',
            dataIndex: 'image',
            key: 'image',
            align: "center",
            width: 300,
            render: (image) => (
                <div className="flex justify-center">
                    <div className="relative w-full h-[80px] max-w-[500px]">
                        <Image src={image} alt="" className="object-contain" fill />
                    </div>
                </div>
            ),
        },
        {
            title: 'Tiêu Đề',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            dataIndex: 'status',
            align: "center",
            render: (status) => {
                const statusColors = {
                    0: { label: 'Hiển Thị', color: 'bg-green-500' },
                    1: { label: 'Đã Ẩn', color: 'bg-yellow-500' },
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
            title: 'Ngày Tạo',
            key: 'date',
            dataIndex: 'date',
            align: "center",
        },
        {
            title: 'Thao Tác',
            align: "center",
            render(_, record) {
                return (
                    <div className="flex justify-center gap-x-[20px]">
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa book"}
                            description={"Bạn có chắc chắn muốn xóa Banner này ?"}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </div>
    
                )
            }
        }
    ];

    return (
        <>
            <h2 className="text-body-bold uppercase">Danh sách Banner</h2>
            <div className="flex justify-end pb-[20px]">
                <Button icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => {
                        setOpenModalCreate(true);
                    }}
                >Thêm mới</Button>
            </div>
            <Table<DataType>
                columns={columns}
                dataSource={data}
                size="small"
            />

            <CreateBanner
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
            />

            <UpdateBanner
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
            />
        </>
    )
}

export default TableBanner
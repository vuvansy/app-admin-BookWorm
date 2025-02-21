"use client"

import { TableProps, Empty, Table, Select } from 'antd';
import Image from 'next/image';
import type { FormProps } from 'antd';
import { Button, Form } from 'antd';
type FieldType = {
    status: number;

};

interface DataTypeOrder {
    key: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

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
        key: '3',
        name: 'Hoàng Tử Bé (Song Ngữ Việt-Anh)',
        image: "/books/sachvanhoa.png",
        price: 10000,
        quantity: 2,
        total: 200000,
    },

];

const InfoOrder = () =>{

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const columnsOrder: TableProps<DataTypeOrder>['columns'] = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            align: "center",
            render: (image) => (
                <div className="flex justify-center">
                    <div className="relative w-[80px] h-[80px]">
                        <Image src={image} alt="" className="object-cover" fill />
                    </div>
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

    return(
        <>
         <div className="flex justify-between pb-[10px]">
                <h2 className="text-body1 uppercase font-semibold">Thông tin đơn hàng</h2>
                <div className="flex gap-[8px]">
                    <p className="font-semibold">67af11e06e65f61d9f0e5900</p>
                    <p className="px-3 bg-yellow-1 text-white font-semibold rounded">Chờ xác nhận</p>
                </div>
            </div>
            <hr />
            <div className="flex justify-between my-[10px]">
                <div className="">
                    <h3 className="font-semibold text-body1 pb-1">Thông Tin Khách Hàng</h3>
                    <p className='pb-1'>Tên: Võ Văn khang</p>
                    <p className='pb-1'>Địa chỉ: 72N đường HT05, HP24, Phường Hiệp Thành, Quận 12, Thành Phố Hồ Chí Minh</p>
                    <p className='pb-1'>SĐT: 0828937376</p>
                    <p className='pb-1'>Email: khangvvps26357.fpt.edu.vn</p>
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
            <div className='my-[10px]'>
                <h3 className="text-body1 font-semibold">Thay Đổi Trạng Thái Đơn Hàng</h3>
                <div className='py-[10px]'>
                    <Form
                        name="form-order"
                        onFinish={onFinish}
                        className='flex gap-x-2'
                    >
                        <Form.Item<FieldType>
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                            className='!mb-0'
                        >
                            <Select
                                showSearch
                                style={{ width: 230 }}
                                placeholder="Cập nhật trạng thái đơn hàng"
                                options={[
                                    { value: "0", label: "Chờ Xác Nhận" },
                                    { value: "1", label: "Đã Xác Nhận" },
                                    { value: "2", label: "Đang Vận Chuyển" },
                                    { value: "3", label: "Đã Giao Hàng" },
                                    { value: "4", label: "Đã Hủy" },
                                ]}
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Áp dụng
                        </Button>
                    </Form>
                </div>
            </div>
            <div className="py-[10px]">
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
        </>
    )
}

export default InfoOrder
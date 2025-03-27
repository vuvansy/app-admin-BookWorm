"use client"

import { TableProps, Empty, Table, Select, Spin, App } from 'antd';
import Image from 'next/image';
import type { FormProps } from 'antd';
import { Button, Form } from 'antd';
import { useParams } from 'next/navigation';
import useSWR, { mutate } from "swr";
import dayjs from 'dayjs';
import { sendRequest } from '@/utils/api';
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

type FieldType = {
    status: number;

};


const InfoOrder = () => {
    const params = useParams();
    const id = params.id as string;
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [status, setStatus] = useState<string>();

    // Lấy thông tin đơn hàng
    const { data: orderData, error: orderError, isLoading: orderLoading } = useSWR<IBackendRes<IHistory>>(
        id ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order-id/${id}` : null,
        fetcher
    );
    // Lấy chi tiết đơn hàng
    const { data: orderDetailData, error: orderDetailError, isLoading: orderDetailLoading } = useSWR<IBackendRes<IOrderDetailTable[]>>(
        id ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order-detail/${id}` : null,
        fetcher
    );

    const order = orderData?.data;
    const orderDetails = orderDetailData?.data;

    useEffect(() => {
        if (!order || order.status === undefined) return;
        setStatus(order.status.toString());
    }, [order]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            const res = await sendRequest<IBackendRes<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order/update-status/${id}`,
                method: "PUT",
                body: { status: Number(values.status) },
            });
            if (res.data) {
                Swal.fire({
                    title: "Thành công",
                    text: "Cập nhật trạng thái đơn hàng thành công!",
                    icon: "success",
                    draggable: true,
                    showCloseButton: false,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2db7f5',
                    position: 'center'
                });
                mutate(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/order-id/${id}`);
            } else {
                message.error("Cập nhật trạng thái thất bại!");
            }

        } catch (error) {
            message.error("Cập nhật trạng thái thất bại!");
        }
    };

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

    if (orderError || orderDetailError) return <div>Lỗi tải dữ liệu</div>;

    if (orderLoading || orderDetailLoading) {
        return (
            <div className="flex items-center justify-center min-h-[100px]">
                <Spin size="large">
                    <span className="">Loading...</span>
                </Spin>
            </div>
        );
    }

    if (!orderData || !orderDetailData) return <div>Không có dữ liệu</div>;


    const statusOptions = [
        { value: "0", label: "Chờ Xác Nhận" },
        { value: "1", label: "Đã Xác Nhận" },
        { value: "2", label: "Đang Vận Chuyển" },
        { value: "3", label: "Đã Giao Hàng" },
        { value: "4", label: "Đã Hủy" },
    ];

    const getAvailableStatusOptions = (currentStatus: number) => {
        switch (currentStatus) {
            case 0:
                return statusOptions;
            case 1:
                return statusOptions.filter(opt => opt.value !== "0");
            case 2:
                return statusOptions.filter(opt => !["0", "1", "4"].includes(opt.value));
            case 3:
            case 4:
                return statusOptions.filter(opt => opt.value === currentStatus.toString());
            default:
                return [];
        }
    };
    const availableOptions = getAvailableStatusOptions(order?.status ?? 0);
    const isDisabled = order?.status === 3 || order?.status === 4;


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
    const address = typeof order?.address === "string" ? JSON.parse(order.address) : order?.address;
    return (
        <>
            <div className="flex justify-between pb-[10px]">
                <h2 className="text-body1 uppercase font-semibold">Thông tin đơn hàng</h2>
                <div className="flex gap-[8px]">
                    <p className="font-semibold">{order?._id}</p>
                    <p className={`px-3 ${getStatusColor(order?.status)} text-white font-semibold rounded`}>
                        {getStatusLabel(order?.status as number)}
                    </p>
                </div>
            </div>
            <hr />
            <div className="flex justify-between my-[10px]">
                <div className="">
                    <h3 className="font-semibold text-body1 pb-1">Thông Tin Khách Hàng</h3>
                    <p className='pb-1'>Tên: {order?.fullName}</p>
                    <p className='pb-1'>Địa chỉ:  {`${address?.street}, ${address?.ward?.name}, ${address?.district?.name}, ${address?.city?.name}`}</p>
                    <p className='pb-1'>SĐT: {order?.phone}</p>
                    <p className='pb-1'>Email: {order?.email}</p>
                </div>
                <div>
                    <div className="mb-2 text-right">
                        <h3 className="font-semibold text-body1">Phương Thức Thanh Toán</h3>
                        <p className="capitalize">{order?.id_payment.name}</p>
                        <p>{(order?.isPaid) ? "✅ Đã thanh toán" : "⏳Chưa thanh toán"}</p>
                        <p>{order?.paidAt ? dayjs(order.paidAt).format("DD-MM-YYYY HH:mm:ss") : ""}</p>
                    </div>
                    <div className="mb-2 text-right">
                        <h3 className="font-semibold text-body1">Phương Thức Vận Chuyển</h3>
                        <p className="capitalize">{order?.id_delivery.name}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-semibold text-body1">Ngày Đặt Hàng</h3>
                        <p>{dayjs(order?.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>
                    </div>
                </div>
            </div>
            <div className='my-[10px]'>
                <h3 className="text-body1 font-semibold">Thay Đổi Trạng Thái Đơn Hàng</h3>
                <div className='py-[10px]'>
                    <Form
                        form={form}
                        name="form-order"
                        onFinish={onFinish}
                        className='flex gap-x-2'
                        initialValues={{ status: order?.status?.toString() }}
                    >
                        <Form.Item<FieldType>
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                            className='!mb-0'
                        >
                            <Select
                                disabled={isDisabled}
                                onChange={(value) => {
                                    setStatus(value);
                                    form.setFieldsValue({ status: value });
                                }}
                                showSearch
                                style={{ width: 230 }}
                                placeholder="Cập nhật trạng thái đơn hàng"
                                options={availableOptions}
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Áp dụng
                        </Button>
                    </Form>
                </div>
            </div>
            <div className="py-[10px]">
                <h2 className="text-body-bold pb-[10px]">Thông Tin Sản Phẩm</h2>
                <Table<IOrderDetailTable>
                    columns={columnsOrder}
                    rowKey="_id"
                    dataSource={orderDetails}
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
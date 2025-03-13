"use client";

import { Table, Button, Input, Space, Drawer, ConfigProvider, Image, Popconfirm, message, Switch, App } from "antd";
import { PlusOutlined, ImportOutlined, ExportOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import type { PopconfirmProps } from 'antd';
import { useEffect, useState } from "react";
import ModalProfile from "./modal-profile";
import ModalEdit from "./modal-edit";
import ModalAdd from "./modal-add";
import { sendRequest } from '@/utils/api'
import { ColumnsType } from "antd/es/table";
import FilterForm from "./form-filter";

type UserData = {
    meta: {
        page: number;
        limit: number;
        pages: number;
        total: number;
    };
    result: IUserTable[];
}

const UserTable = () => {
    const { message, modal, notification } = App.useApp();
    const [openProfile, setOpenProfile] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUserTable | null>(null);
    const [user, setUser] = useState<IUserTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({
        page: 1,
        limit: 5,
        pages: 0,
        total: 0,
    });
    const [filter, setFilter] = useState({ fullName: "", email: "" });

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await sendRequest<IBackendRes<UserData>>({
                url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user`,
                method: "GET",
                queryParams: {
                    page: meta.page,
                    limit: meta.limit,
                    fullName: filter.fullName,
                    email: filter.email,
                }
            });

            if (res?.data) {
                console.log("Dữ liệu nhận được:", res.data);

                if (res.data.result && Array.isArray(res.data.result)) {
                    // Đã sort trên server nên không cần sort lại ở client
                    setUser(res.data.result);

                    if (res.data.meta) {
                        setMeta(res.data.meta);
                    }
                } else {
                    setUser([]);
                }
            } else {
                message.error(res?.message || 'Không thể tải dữ liệu người dùng');
                setUser([]);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu người dùng:', error);
            message.error('Có lỗi xảy ra khi tải dữ liệu người dùng');
            setUser([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Một biến flag để theo dõi component có mount hay không
        let isMounted = true;

        const loadData = async () => {
            await fetchUser();
        };

        loadData();

        // Cleanup function để tránh memory leak
        return () => {
            isMounted = false;
        };

        // Chỉ re-fetch khi các dependencies thực sự thay đổi
    }, [meta.page, meta.limit, filter.fullName, filter.email, reloadData]);

    const handleFilter = (values: any) => {
        setMeta(prev => ({
            ...prev,
            page: 1
        }));
        setFilter(values);
    };
    const handleUserAdded = () => {
        setReloadData(prev => !prev); // Đảo ngược giá trị để kích hoạt useEffect
    };

    const showDrawer = (user: IUserTable) => {
        setSelectedUser(user);
        setOpenProfile(true);
    };

    const showEdit = (user: IUserTable) => {
        setSelectedUser(user);
        setOpenEdit(true);
    };

    useEffect(() => {
        if (!openEdit) {
            setSelectedUser(null);
        }
    }, [openEdit]);

    const onClose = () => {
        setOpenProfile(false);
        setSelectedUser(null);
    };

    const handleToggleUserStatus = async (newBlockedState: boolean, _id: string) => {
        try {
            const res = await sendRequest<IBackendRes<IUserTable>>({
                url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user/${_id}`,
                method: "PATCH",
                body: { isBlocked: newBlockedState }
            });

            if (!res.data) {
                message.success(res.message || `Đã ${newBlockedState ? 'khóa' : 'mở khóa'} tài khoản thành công`);

                // Cập nhật state ngay lập tức để UI phản ánh thay đổi mà không cần gọi lại API
                setUser(prevUsers =>
                    prevUsers.map(user =>
                        user._id === _id ? { ...user, isBlocked: newBlockedState } : user
                    )
                );
            } else {
                message.error(res?.message || 'Cập nhật trạng thái thất bại');
                // Nếu thất bại, tải lại dữ liệu để đồng bộ UI với server
                fetchUser();
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            message.error('Có lỗi xảy ra khi cập nhật trạng thái người dùng');
            // Nếu có lỗi, tải lại dữ liệu để đồng bộ UI với server
            fetchUser();
        }
    };

    const columns: ColumnsType<IUserTable> = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text: string, record) => <div>
                <a className="text-blue-500" onClick={() => showDrawer(record)}>{text}</a>
            </div>,
        },
        {
            title: 'Tên Người Dùng',
            dataIndex: 'fullName',
            render: (fullName: string, record) => <div>{fullName}</div>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (email: string, record) => <div>{email}</div>
        },
        {
            title: 'Ủy Quyền',
            dataIndex: 'role',
            render: (role: string, record) => <div>{role}</div>
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            render: (createdAt: string, record) => <div> {new Date(createdAt).toLocaleDateString()}</div>,
            sorter: {
                compare: (a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA; // Mặc định sắp xếp giảm dần (mới nhất trước)
                },
                multiple: 1
            },
        },
        {
            title: 'Khóa',
            dataIndex: 'isBlocked',
            render: (isBlocked: boolean, record) => (
                <Popconfirm
                    title={`${isBlocked ? 'Mở khóa' : 'Khóa'} tài khoản`}
                    description={`Bạn có chắc chắn muốn ${isBlocked ? 'mở khóa' : 'khóa'} tài khoản của ${record.fullName}?`}
                    onConfirm={() => handleToggleUserStatus(!isBlocked, record._id)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Switch
                        checked={isBlocked}
                    />
                </Popconfirm>
            ),
        },
        {
            title: 'Thao Tác',
            align: 'center' as 'center',
            render: (_: any, record) => (
                <EditTwoTone twoToneColor={'#f57800'} onClick={() => showEdit(record)} className="px-[10px]" />
            ),
        },
    ];

    return (
        <>
            <FilterForm onFilter={handleFilter} />
            <div className="mt-5 bg-white rounded px-5">
                <div className="flex justify-between items-center">
                    <div className="text-body-bold leading-[60px] bg-white rounded uppercase">
                        Quản lý người dùng
                    </div>
                    <div className=" flex space-x-2 items-center">
                        <Button icon={<ExportOutlined />} type="primary">Export</Button>
                        <Button icon={<ImportOutlined />} type="primary">Import</Button>
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenAdd(true)}>Thêm mới</Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={user}
                    loading={loading}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.limit,
                        showSizeChanger: true,
                        total: meta.total,
                        onChange: (page, pageSize) =>
                            setMeta((prev) => ({
                                ...prev,
                                page: page,
                                limit: pageSize,
                            })),
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}-{range[1]} trên {total} rows
                            </div>
                        ),
                    }}
                    onChange={(pagination, filters, sorter, extra) => {
                        // Xử lý khi người dùng thay đổi cách sắp xếp
                        console.log('Thông tin sắp xếp:', sorter);
                    }}
                    rowKey="_id"
                    size="small"
                />
                <ModalProfile open={openProfile} user={selectedUser} onClose={onClose} />
                <ModalAdd
                    openAdd={openAdd}
                    setOpenAdd={setOpenAdd}
                    setMeta={setMeta} // Truyền hàm setMeta vào ModalAdd
                    onUserAdded={handleUserAdded} // Truyền hàm handleUserAdded vào ModalAdd
                />
                <ModalEdit openEdit={openEdit} user={selectedUser} setOpenEdit={setOpenEdit} onSuccess={fetchUser} />
            </div>
        </>
    );
};

export default UserTable;
"use client"

import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    HeartTwoTone,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
    AuditOutlined,
    TagsOutlined,
    CommentOutlined,
    LineChartOutlined,
    CaretDownOutlined,
    ProfileOutlined,
    FileImageOutlined,
    FileDoneOutlined,
} from '@ant-design/icons';
import { IoNewspaperOutline, IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { Layout, Menu, Dropdown, Space, Avatar, Modal, Popconfirm, App } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentApp } from "@/context/app.context";
import { sendRequest } from "@/utils/api";
import Image from 'next/image';

type MenuItem = Required<MenuProps>['items'][number];
const { Content, Footer, Sider } = Layout;

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const router = useRouter();
    const [isModelLogout, setIsModelLogout] = useState(false);


    const handleLogout = async () => {
        //todo
        // Logic xử lý đăng xuất
        const res = await sendRequest<IBackendRes<IFetchAccount>>({
            url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/logout`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            useCredentials: true,
        });
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            router.push('/login');
        }
        // Khi người dùng bấm hủy, không làm gì cả
    }

    const items: MenuItem[] = [
        {
            label: <Link href='/'>Trang chủ</Link>,
            key: '/',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link href='/admin/order'>Đơn hàng</Link>,
            key: '/admin/order',
            icon: <DollarCircleOutlined />
        },
        {
            label: <Link href='/admin/banner'>Banner</Link>,
            key: '/admin/banner',
            icon: <FileImageOutlined />,
        },
        {
            label: <Link href='/admin/user'>Người dùng</Link>,
            key: '/admin/user',
            icon: <UserOutlined />,
        },
        {
            label: <Link href='/admin/genre'>Danh mục</Link>,
            key: '/admin/genre',
            icon: <FileDoneOutlined />
        },
        {
            label: <Link href='/admin/book'>Sản phẩm</Link>,
            key: '/admin/book',
            icon: <ReadOutlined />
        },
        {
            label: <Link href='/admin/author'>Tác giả</Link>,
            key: '/admin/author',
            icon: <AuditOutlined />
        },
        {
            label: <Link href='/admin/coupons'>Mã giảm giá</Link>,
            key: '/admin/coupons',
            icon: <TagsOutlined />
        },
        {
            label: <Link href='/admin/reviews'>Phản hồi</Link>,
            key: '/admin/reviews',
            icon: <CommentOutlined />
        },
        {
            label: <Link href='/admin/news'>Tin tức</Link>,
            key: '/admin/news',
            icon: <IoNewspaperOutline />
        },
        {
            label: <span>Thống kê</span>,
            key: '/admin/statistics',
            icon: <LineChartOutlined />,
            children: [
                {
                    label: <Link href='/admin/statistics/bookwarning'>SP Sắp Hết</Link>,
                    key: "/admin/statistics/bookwarning",
                    icon: <ProfileOutlined />,
                },
                {
                    label: <Link href='/admin/statistics/statisticdetail'>Thông Kê</Link>,
                    key: "/admin/statistics/statisticdetail",
                    icon: <ProfileOutlined />,
                },
            ]
        },

    ];
    const { isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();
    useEffect(() => {
        const fetchAccount = async () => {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                router.push('/login');
            } else {
                const res = await sendRequest<IBackendRes<IFetchAccount>>({
                    url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/account`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    // useCredentials: true,
                })
                if (res.data) {
                    setUser(res.data.user)
                    setIsAuthenticated(true);
                }
            }
        }
        fetchAccount();
    }, [])

    useEffect(() => {
        const foundItem = items.find((item) => item?.key === pathname) || null;
        const foundParent = items.find(
            (item) =>
                item &&
                "children" in item &&
                Array.isArray(item.children) &&
                item.children.some((subItem) => subItem?.key === pathname)
        ) || null;

        if (foundItem) {
            setActiveMenu(foundItem.key?.toString() ?? "");
            setOpenKeys([]);
        } else if (foundParent) {
            setActiveMenu(pathname.toString() ?? "");
            setOpenKeys([foundParent.key?.toString() ?? ""]);
        } else {
            setActiveMenu("");
            setOpenKeys([]);
        }
    }, [pathname]);

    const itemsDropdown = [
        {
            label: (
                <Link href="/admin/account" className="flex items-center gap-x-2">
                    <FaRegUser className="text-[18px]" />
                    <span>Quản lý tài khoản</span>
                </Link>
            ),
            key: 'account',
        },
        {
            label: (
                <Link href="/admin/change-password" className="flex items-center gap-x-2">
                    <IoSettingsOutline className="text-[18px]" />
                    <span>Đổi mật khẩu</span>
                </Link>
            ),
            key: 'change-password',
        },
        {
            label: (
                <div className="flex items-center gap-x-2"
                    onClick={() => setIsModelLogout(true)}
                >
                    <TbLogout className="text-[18px]" />
                    {/* <Popconfirm
                        placement='topRight'
                        title="Xác nhận đăng xuất"
                        description="Bạn có chắc chắn muốn đăng xuất không?"
                        onConfirm={handleLogout}
                        okText="Có"
                        cancelText="Hủy"
                    >
                        
                    </Popconfirm> */}
                    <span style={{ cursor: 'pointer' }}>Đăng xuất</span>
                </div>
            ),
            key: 'logout',
        },
    ];

    return (
        <>
            <App>
                <Layout
                    style={{ minHeight: '100vh' }}
                    className="layout-admin"
                >
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                    >
                        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                            <Link href="/" className='text-bg-text'>
                                <div className="relative w-[170px]">
                                    <Image
                                        src={"/icon/logo.png"}
                                        alt={'logo BookWorm'}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                        }}
                                        priority
                                        className="w-full object-cover"
                                    />
                                </div>
                            </Link>
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            openKeys={openKeys}
                            mode="inline"
                            items={items}
                            onOpenChange={setOpenKeys}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    <Layout>
                        <div className='admin-header' style={{
                            height: "50px",
                            borderBottom: "1px solid #ebebeb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 80px 0 15px",
                        }}>
                            <span>
                                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: () => setCollapsed(!collapsed),
                                })}
                            </span>
                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    <Avatar src={'/avatar/avatar.jpg'} />
                                    Xin Chào, {user?.fullName}
                                    <CaretDownOutlined />
                                </Space>
                            </Dropdown>
                        </div>
                        <Content style={{ padding: '15px' }}>
                            {children}
                        </Content>
                        <Footer style={{ padding: 0, textAlign: "center" }}>
                            Website BookWorm &copy; FPT Polytechnic <HeartTwoTone />
                        </Footer>
                    </Layout>
                </Layout>
                <Modal
                    title="Xác nhận đăng xuất"
                    open={isModelLogout}
                    onOk={handleLogout}
                    onCancel={() => setIsModelLogout(false)}
                    okText="Có"
                    cancelText="Hủy"
                // okButtonProps={{ danger: true }}
                >
                    <p>Bạn có chắc chắn muốn đăng xuất không?</p>
                </Modal>

            </App>
        </>
    );
}

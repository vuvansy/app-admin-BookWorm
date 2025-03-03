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
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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


    const handleLogout = async () => {
        //todo
        // Logic xử lý đăng xuấ
    }

    const items: MenuItem[] = [
        {
            label: <Link href='/'>Dashboard </Link>,
            key: '/',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link href='/admin/order'>Đơn Hàng</Link>,
            key: '/admin/order',
            icon: <DollarCircleOutlined />
        },
        {
            label: <Link href='/admin/user'>Người Dùng</Link>,
            key: '/admin/user',
            icon: <UserOutlined />,
        },
        {
            label: <Link href='/admin/banner'>Banner</Link>,
            key: '/admin/banner',
            icon: <FileImageOutlined />,
        },
        {
            label: <Link href='/admin/genre'>Danh Mục</Link>,
            key: '/admin/genre',
            icon: <FileDoneOutlined />
        },
        {
            label: <Link href='/admin/book'>Sản Phẩm</Link>,
            key: '/admin/book',
            icon: <ReadOutlined />
        },
        {
            label: <Link href='/admin/author'>Tác Giả</Link>,
            key: '/admin/author',
            icon: <AuditOutlined />
        },
        {
            label: <Link href='/admin/coupons'>Mã Giảm Giá</Link>,
            key: '/admin/coupons',
            icon: <TagsOutlined />
        },
        {
            label: <Link href='/admin/reviews'>Phản Hồi</Link>,
            key: '/admin/reviews',
            icon: <CommentOutlined />
        },

        {
            label: <span>Thống Kê</span>,
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
                <div className="flex items-center gap-x-2">
                    <TbLogout className="text-[18px]" />
                    <label
                        style={{ cursor: 'pointer' }}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </label>
                </div>
            ),
            key: 'logout',
        },
    ];

    return (
        <>
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
                        <Link href="/" className='text-bg-text'>Admin</Link>
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
                                Xin Chào, Admin
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
        </>
    );
}

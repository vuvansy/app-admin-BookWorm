"use client"

import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
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
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];
const { Content, Footer, Sider } = Layout;

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const items: MenuItem[] = [
        {
            label: <Link href='/'>Trang chủ</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link href='/admin/user'>Người dùng</Link>,
            key: 'user',
            icon: <UserOutlined />,
        },

        {
            label: <Link href='/admin/genre'>Danh mục</Link>,
            key: 'genre',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link href='/admin/book'>Sản phẩm</Link>,
            key: 'book',
            icon: <ReadOutlined />
        },
        {
            label: <Link href='/admin/author'>Tác giả</Link>,
            key: 'author',
            icon: <AuditOutlined />
        },
        {
            label: <Link href='/admin/coupons'>Mã giảm giá</Link>,
            key: 'coupons',
            icon: <TagsOutlined />
        },
        {
            label: <Link href='/admin/reviews'>Phản hồi</Link>,
            key: 'reviews',
            icon: <CommentOutlined />
        },
        {
            label: <Link href='/admin/order'>Đơn hàng</Link>,
            key: 'order',
            icon: <DollarCircleOutlined />
        },
        {
            label: <Link href='/admin/statistics'>Thống kê</Link>,
            key: 'statistics',
            icon: <LineChartOutlined />
        },

    ];

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link href={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}

            >Đăng xuất</label>,
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
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
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

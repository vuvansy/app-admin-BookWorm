'use client'

import { Button, ConfigProvider, Drawer, Image } from "antd";
import { User } from "./user-table";
import React, { useState } from "react";
import Link from "next/link";

interface UserDrawerProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
}

const ModalProfile: React.FC<UserDrawerProps> = ({ open, user, onClose }) => {

    return (

        <ConfigProvider
            theme={{
                token: {
                    colorBgMask: 'rgba(0,0,0,0.1)',
                },
            }}
        >
            <Drawer
                title="Thông Tin Người Dùng" onClose={onClose} open={open} maskClosable={true} width={"46vw"}
            >
                {user && (
                    <div className="">
                        <div className="flex flex-wrap rounded ">
                            <div className="w-full flex">
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10 rounded-tl-lg">Id</div>
                                    <div className="basis-7/12 leading-[30px] text-body1 flex items-center justify-center border border-bg-main">{user.id}</div>
                                </div>
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Tên hiển thị</div>
                                    <div className="basis-7/12 leading-[30px] text-body1 flex items-center justify-center border border-bg-main">{user.fullName}</div>
                                </div>
                            </div>
                            <div className="w-full flex">
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Email</div>
                                    <div className="basis-7/12 leading-[30px] text-body1 flex items-center justify-center border border-bg-main">{user.email}</div>
                                </div>
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Số điện thoại</div>
                                    <div className="basis-7/12 leading-[30px] text-body1 flex items-center justify-center border border-bg-main">{user.phone}</div>
                                </div>
                            </div>
                            <div className="w-full flex">
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Ủy Quyền</div>
                                    <div className="basis-7/12 leading-[30px] text-body1 flex items-center justify-center border border-bg-main">{user.role}</div>
                                </div>
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Ảnh đại diện</div>
                                    <div className="basis-7/12 flex items-center justify-center border border-bg-main"><Image width={60} height={60} alt="User Avatar" className="rounded-full" src={user.image} /></div>
                                </div>
                            </div>
                            <div className="w-full flex">
                                <div className="w-[21%] leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Địa chỉ</div>
                                <div className="basis-4/5 leading-[30px] text-body1 flex items-center px-4 border border-bg-main">
                                    {`${user.address.specific_address}, ${user.address.ward}, ${user.address.district}, ${user.address.city}`}
                                </div>
                            </div>
                            {/* <div className="w-full flex">
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Ngày Tạo</div>
                                    <div className="basis-7/12 leading-[30px] text-body1 flex items-center justify-center border border-bg-main">{user.createdAt}</div>
                                </div>
                                <div className="flex-1 flex">
                                    <div className="basis-5/12 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Ngày Cập Nhật</div>
                                    <div className="basis-7/12 leading-[30px] text-body1 flex items-center justify-center border border-bg-main">{user.updatedAt}</div>
                                </div>
                            </div> */}
                            <div className="w-full flex justify-start mt-5">
                                <Button type="primary"  >
                                    <Link href={`/admin/order/${user.id}`}>
                                        Lịch Sử Đơn Hàng
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </Drawer>
        </ConfigProvider>

    );
};
export default ModalProfile;
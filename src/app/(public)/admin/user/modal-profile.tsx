'use client'

import { ConfigProvider, Drawer, Image } from "antd";
import { User } from "./user-table";
import React, { useState } from "react";

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
                title="Thông Tin Người Dùng" onClose={onClose} open={open} maskClosable={true} width={700}
            >
                {user && (
                    <div className="">
                        <div className="w-[650px] grid grid-cols-2 rounded-lg ">
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10 rounded-tl-lg">Id</div>
                                <div className="basis-2/3 leading-[60px] text-body1 flex items-center justify-center border border-bg-main">{user.id}</div>
                            </div>
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Tên hiển thị</div>
                                <div className="basis-2/3 leading-[60px] text-body1 flex items-center justify-center border border-bg-main">{user.fullName}</div>
                            </div>
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Email</div>
                                <div className="basis-2/3 leading-[60px] text-body1 flex items-center justify-center border border-bg-main">{user.email}</div>
                            </div>
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Số điện thoại</div>
                                <div className="basis-2/3 leading-[60px] text-body1 flex items-center justify-center border border-bg-main">{user.phone}</div>
                            </div>
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Role</div>
                                <div className="basis-2/3 leading-[60px] text-body1 flex items-center justify-center border border-bg-main">{user.role}</div>
                            </div>
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Ảnh đại diện</div>
                                <div className="basis-2/3 flex items-center justify-center border border-bg-main"><Image width={60} height={60} alt="User Avatar" className="rounded-full" src={user.image} /></div>
                            </div>
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Create At</div>
                                <div className="basis-2/3 leading-[60px] text-body1 flex items-center justify-center border border-bg-main">{user.createdAt}</div>
                            </div>
                            <div className="w-[325px] flex">
                                <div className="basis-1/3 leading-[60px] text-body1 flex items-center justify-center bg-bg-main border border-black/10">Update At</div>
                                <div className="basis-2/3 leading-[60px] text-body1 flex items-center justify-center border border-bg-main">{user.updatedAt}</div>
                            </div>
                        </div>
                    </div>
                )}

            </Drawer>
        </ConfigProvider>

    );
};
export default ModalProfile;
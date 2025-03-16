"use client";
import React from "react";
import { Drawer } from "antd";

interface CouponDetailProps {
  coupon?: ICouponTable | null;
  visible: boolean;
  onClose: () => void;
}

const CouponDetail: React.FC<CouponDetailProps> = ({
  coupon,
  visible,
  onClose,
}) => {
  return (
    <Drawer
      title="Chi Tiết Coupon"
      placement="right"
      onClose={onClose}
      open={visible}
      width="60vw"
    >
      {coupon && (
        <div className="flex flex-wrap rounded">
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[40%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10 rounded-tl-lg">
                ID
              </div>
              <div className="w-[60%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {coupon._id}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[40%] flex items-center justify-center bg-bg-main border border-black/10">
                Mã Giảm Giá
              </div>
              <div className="w-[60%] leading-[20px] flex items-center border border-bg-main pl-[15px] py-[5px]">
                {coupon.code}
              </div>
            </div>
          </div>
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[40%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Giảm Giá
              </div>
              <div className="w-[60%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {Intl.NumberFormat("vi-VN").format(coupon.value)} %
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[40%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Giá Giảm Tối Đa
              </div>
              <div className="w-[60%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {coupon.max_value ? (
                  <span>
                    {Intl.NumberFormat("vi-VN").format(coupon.max_value)} đ
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[40%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Đơn Hàng Tối Thiểu
              </div>
              <div className="w-[60%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {Intl.NumberFormat("vi-VN").format(coupon.min_total)} đ
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[40%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Số Lượng
              </div>
              <div className="w-[60%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {coupon.quantity}
              </div>
            </div>
          </div>

          <div className="w-full flex text-caption">
            <div className="flex-1 flex">
              <div className="w-[40%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Ngày Bắt Đầu
              </div>
              <div className="w-[60%] leading-[30px] flex items-center border border-bg-main px-[15px]">
                {new Date(coupon.start_date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-[40%] leading-[60px] flex items-center justify-center bg-bg-main border border-black/10">
                Ngày Kết Thúc
              </div>
              <div className="w-[60%] leading-[30px] flex items-center border border-bg-main pl-[15px]">
                {new Date(coupon.end_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CouponDetail;

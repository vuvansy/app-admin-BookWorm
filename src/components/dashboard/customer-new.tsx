
import { Avatar } from "antd"
import Link from "next/link"
import { UserOutlined } from "@ant-design/icons";

const CustomerNew = () => {
    return (
        <div className="basis-4/12 bg-white px-[15px]  py-[20px] rounded border">
            <h2 className="text-body-bold pb-[10px]">Khách hàng mới</h2>
            <div className="rounded border flex items-center justify-between gap-[10px] p-[10px] mb-[10px]">
                <div className="basic-4/6 flex items-center gap-[20px] pl-2">
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div className="">
                        <p className="text-body1">Vũ Trần Nhật Quỳnh</p>
                        <p>Đang truy cập</p>
                    </div>
                </div>
                <div className="basic-2/6">
                    <Link href="/admin/user/1" className="bg-[#0D63D6] text-body1 py-1 px-2 text-white rounded-md font-medium">Xem chi tiết</Link>
                </div>
            </div>
            <div className="rounded border flex items-center justify-between gap-[10px] p-[10px] mb-[10px]">
                <div className="basic-4/6 flex items-center gap-[20px] pl-2">
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div className="">
                        <p className="text-body1">Tạ Văn Tuấn</p>
                        <p>Đang truy cập</p>
                    </div>
                </div>
                <div className="basic-2/6">
                    <Link href="/admin/user/1" className="bg-[#0D63D6] text-body1 py-1 px-2 text-white rounded-md font-medium">Xem chi tiết</Link>
                </div>
            </div>
        </div>
    )
}

export default CustomerNew
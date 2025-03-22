"use client"

import { Col, Row, Statistic } from "antd"
import { FaMoneyBills } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { BiSolidMessageDetail } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi2";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import useSWR from "swr";
const fetcher = (...args: [RequestInfo, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

const MetricsOverview = () => {

    const [dataDashboard, setDataDashboard] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalReviews: 0,
        totalProducts: 0
    })

    const { data, error, isLoading } = useSWR<IBackendRes<Stats>>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/stats`,
        fetcher
    );
    const dataStats = data?.data;
    useEffect(() => {
        if (dataStats) {
            setDataDashboard({
                totalOrders: dataStats.totalOrders || 0,
                totalRevenue: dataStats.totalRevenue || 0,
                totalUsers: dataStats.totalUsers || 0,
                totalReviews: dataStats.totalReviews || 0,
                totalProducts: dataStats.totalProducts || 0
            });
        }
    }, [dataStats]);


    const formatter = (value: any) => <CountUp end={value} separator="," />;
    return (
        <div className="mb-5">
            <Row gutter={[20, 20]}>
                <Col span={6}>
                    <div className="flex rounded border h-[90px] bg-white">
                        <div className="py-[25px] bg-red1 basis-2/6 flex items-center justify-center">
                            <FaMoneyBills className="text-white text-[30px] " />
                        </div>
                        <div className="basis-4/6 flex flex-col py-4 pl-3">
                            <h3 className="text-body1 uppercase">Đơn hàng</h3>
                            <div className="text-info-bold">
                                <Statistic
                                    value={dataDashboard?.totalOrders}
                                    formatter={formatter}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="flex rounded border h-[90px] bg-white">
                        <div className="py-[25px] bg-[#166B14] basis-2/6 flex items-center justify-center">
                            <MdAttachMoney className="text-white text-[30px] " />
                        </div>
                        <div className="basis-4/6 flex flex-col py-4 pl-3">
                            <h3 className="text-body1 uppercase">Tổng doanh thu</h3>
                            <div className="text-body-bold">
                                <Statistic
                                    value={dataDashboard?.totalRevenue}
                                    formatter={formatter}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="flex rounded border h-[90px] bg-white">
                        <div className="py-[25px] bg-[#0D63D6] basis-2/6 flex items-center justify-center">
                            <HiUserGroup className="text-white text-[30px] " />
                        </div>
                        <div className="basis-4/6 flex flex-col py-4 pl-3">
                            <h3 className="text-body1 uppercase">Tổng người dùng</h3>
                            <div className="text-body-bold">
                            <Statistic
                                    value={dataDashboard?.totalUsers}
                                    formatter={formatter}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="flex rounded border h-[90px] bg-white">
                        <div className="py-[25px] bg-yellow-1 basis-2/6 flex items-center justify-center">
                            <BiSolidMessageDetail className="text-white text-[30px] " />
                        </div>
                        <div className="basis-4/6 flex flex-col py-4 pl-3">
                            <h3 className="text-body1 uppercase">Tổng đánh giá</h3>
                            <div className="text-body-bold">
                                <Statistic
                                    value={dataDashboard?.totalReviews}
                                    formatter={formatter}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default MetricsOverview
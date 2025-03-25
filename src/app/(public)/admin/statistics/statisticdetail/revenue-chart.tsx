"use client"

import { Button, Select, Skeleton, Spin } from "antd"
import { Chart as ChartJS, defaults, plugins } from "chart.js/auto";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import useSWR, { mutate } from "swr";

const fetcher = (...args: [RequestInfo, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font = { size: 20 };
defaults.plugins.title.color = "black";

interface DataOrderType {
    key: string;
    value: number;
}

const RevenueChart = () => {

    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

    const baseUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/stats/revenue`;
    const queryParams = new URLSearchParams();
    if (selectedYear) queryParams.append("year", selectedYear.toString());
    if (selectedMonth) queryParams.append("month", selectedMonth.toString());

    const apiUrl = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;

    const { data, error, isLoading } = useSWR<IBackendRes<IRevenueStats>>(
        apiUrl,
        fetcher
    );

    const handleYearChange = (value: number) => {
        setSelectedYear(value);
        setSelectedMonth(undefined);
    };

    const handleMonthChange = (value: number) => {
        if (!selectedYear) return;
        setSelectedMonth(value);
    };

    const handleReset = () => {
        setSelectedYear(undefined);
        setSelectedMonth(undefined);
    };

    const revenueStats: IRevenueStats = data?.data ?? {};
    const filteredData: DataOrderType[] = Object.entries(revenueStats).map(([key, value]) => ({
        key,
        value
    }));
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div style={{ padding: 50 }}>
                    <Skeleton active />
                </div>
            </div>
        );
    };
    if (error || !data?.data) return <p>Lỗi khi tải dữ liệu!</p>;

    const yearOptions = [
        { value: 2021, label: "Năm 2021" },
        { value: 2022, label: "Năm 2022" },
        { value: 2023, label: "Năm 2023" },
        { value: 2024, label: "Năm 2024" },
        { value: 2025, label: "Năm 2025" },
        { value: 2026, label: "Năm 2026" },
        { value: 2027, label: "Năm 2027" },
    ];

    const monthOptions = [
        { value: 0, label: "Tất cả" },
        { value: 1, label: "Tháng 1" },
        { value: 2, label: "Tháng 2" },
        { value: 3, label: "Tháng 3" },
        { value: 4, label: "Tháng 4" },
        { value: 5, label: "Tháng 5" },
        { value: 6, label: "Tháng 6" },
        { value: 7, label: "Tháng 7" },
        { value: 8, label: "Tháng 8" },
        { value: 9, label: "Tháng 9" },
        { value: 10, label: "Tháng 10" },
        { value: 11, label: "Tháng 11" },
        { value: 12, label: "Tháng 12" },
    ];
    return (
        <>
            <div className="w-[49%] bg-white px-[15px] py-[20px] rounded border">
                <div className="flex justify-between">
                    <h2 className="text-body-bold pb-[10px]">Biểu Đồ Doanh Thu 6 Tháng Gần Nhất</h2>
                    <div className="flex gap-5">
                        <Select
                            style={{ width: 120 }}
                            value={selectedYear}
                            placeholder="Chọn Năm"
                            onChange={handleYearChange}
                            options={yearOptions}
                            allowClear
                        />
                        <Select
                            style={{ width: 120 }}
                            placeholder="Chọn Tháng"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            options={monthOptions}
                            allowClear
                            disabled={!selectedYear}
                        />
                        <Button type="primary" onClick={handleReset}>
                            Đặt Lại
                        </Button>
                    </div>
                </div>
                <div>
                    <Bar
                        data={{
                            labels: filteredData.map((data) => data.key),
                            datasets: [
                                {
                                    label: "Doanh thu",
                                    data: filteredData.map((data) => data.value),
                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                },

                            ],
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default RevenueChart
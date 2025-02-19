"use client"

import { Select } from "antd"
import { Chart as ChartJS, defaults, plugins } from "chart.js/auto";
import { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font = { size: 20 };
defaults.plugins.title.color = "black";

interface DataOrderType {
    key: string;
    value: number;
}

const dataOrder: DataOrderType[] = [
    {
        key: "Tháng 1",
        value: 200
    },
    {
        key: "Tháng 2",
        value: 500
    },
    {
        key: "Tháng 3",
        value: 100
    },
    {
        key: "Tháng 4",
        value: 6000
    },
    {
        key: "Tháng 5",
        value: 4000
    }
]

const Statistical = () => {
    const [selectedMonth, setSelectedMonth] = useState("1");

    const handleChange = (value: string) => {
        setSelectedMonth(value);
    };

    const filteredData =
        selectedMonth === "1"
            ? dataOrder
            : dataOrder.filter((item) => item.key === selectedMonth);

    return (
        <>
            <div className="basis-8/12 bg-white px-[15px] py-[20px] rounded border">
                <div className="flex justify-between">
                    <h2 className="text-body-bold pb-[10px]">Biểu Đồ Doanh Thu</h2>
                    <div>
                        <Select
                            showSearch
                            style={{ width: 160 }}
                            placeholder="Search to Select"
                            defaultValue="1"
                            value={selectedMonth}
                            onChange={handleChange}
                            options={[
                                { value: "1", label: "Tất Cả" },
                                ...dataOrder.map((item) => ({
                                    value: item.key,
                                    label: item.key,
                                })),
                            ]}
                        />
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
                                },

                            ],
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default Statistical
'use client'
import React, { useState } from "react";


import { Button, message, Popconfirm, PopconfirmProps, Space, Table } from "antd";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import AddAuthor from "./add-author";
import EditAuthor from "./edit-author";

interface Author {
    id: string;
    name: string;
}

const data: Author[] = [
    {
        id: "67441ccbdrcaffdsfsdf07",
        name: "khang",
    },
    {
        id: "67441ccbdrcaffdsfsdf08",
        name: "tuan",
    },
    {
        id: "67441ccbdrcaffdsfsdf09",
        name: "sy",
    },
    {
        id: "67441ccbdrcaffdsfsdf01",
        name: "kha",
    },
    {
        id: "67441ccbdrcaffdsfsdf02",
        name: "khang",
    },
    {
        id: "67441ccbdrcaffdsfsdf03",
        name: "tuan",
    },

];

const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Click on Yes");
};

const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
};
const AuthorTable = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const showEdit = (author: Author) => {
        setSelectedAuthor(author);
        setOpenEdit(true);
    };
    const onCloseEdit = () => {
        setOpenEdit(false);
        setSelectedAuthor(null);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center' as 'center',
            render: (_: any, __: Author, index: number) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Tên Tác Giả',
            dataIndex: 'name',
            align: 'center' as 'center',
        },
        {
            title: 'Thao Tác',
            align: 'center' as 'center',
            width: 600,
            render: (_: any, record: Author) => (
                <Space size="middle">
                    {<EditTwoTone twoToneColor={'#f57800'} onClick={() => showEdit(record)} className="px-[10px]" />}

                    <Popconfirm
                        placement="leftTop"
                        title="Delete the task"
                        description="Bạn có chắc chắn muốn xóa tác giả này không?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <span className="cursor-pointer">{<DeleteTwoTone twoToneColor={'#ff4d4f'} />}</span>
                    </Popconfirm>

                </Space>
            ),
        },
    ];
    return (
        <div>
            <div className="bg-white w rounded p-4">
                <p className=" text-body-bold uppercase">Quản Lý Tác Giả</p>
                <div className="flex justify-end pb-5">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenAdd(true)}>Thêm mới</Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        pageSize,
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                    size="small"
                    rowKey="id"
                    className="ant-table-striped"
                />
            </div>
            <AddAuthor openAdd={openAdd} setOpenAdd={setOpenAdd} />

            <EditAuthor
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
                author={selectedAuthor}

            />
        </div>
    );
};
export default AuthorTable;

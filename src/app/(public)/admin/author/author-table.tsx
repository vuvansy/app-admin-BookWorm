'use client'
import React, { useEffect, useState } from "react";


import { Button, message, Popconfirm, PopconfirmProps, Space, Table } from "antd";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import AddAuthor from "./add-author";
import EditAuthor from "./edit-author";
import { sendRequest } from "@/utils/api";
import { ColumnsType } from "antd/es/table";


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
    const [author, setAuthor] = useState<IAuthorTable[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<IAuthorTable | null>(null);
    // const [currentPage, setCurrentPage] = useState(1);
    // const pageSize = 5;
    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const res = await sendRequest<IBackendRes<IAuthorTable[]>>({
                    url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/author`,
                    method: "GET",
                });
                console.log(res.data);
                if (res.data) {
                    const sortedData = [...res.data].sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
                    });
                    setAuthor(sortedData);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAuthor();

    }, []);
    const showEdit = (author: IAuthorTable) => {
        setSelectedAuthor(author);
        setOpenEdit(true);
    };
    useEffect(() => {
        if (!openEdit) {
            setSelectedAuthor(null);
        }
    }, [openEdit]);
    const onCloseEdit = () => {
        setOpenEdit(false);
        setSelectedAuthor(null);
    };

    const columns: ColumnsType<IAuthorTable> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center' as 'center',
            render: (_: any, __: IAuthorTable, index: number) => index + 1,
            // => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Tên Tác Giả',
            dataIndex: 'name',
            align: 'center' as 'center',
            render: (name: string) => <div>{name}</div>,
        },
        {
            title: 'Thao Tác',
            align: 'center' as 'center',
            width: 600,
            render: (_: any, record) => (
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
                    dataSource={author}
                    // pagination={{
                    //     pageSize,
                    //     current: currentPage,
                    //     onChange: (page) => setCurrentPage(page),
                    // }}
                    size="small"
                    rowKey="_id"
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

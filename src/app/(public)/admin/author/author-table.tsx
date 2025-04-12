'use client'
import React, { useEffect, useState } from "react";


import { Button, message, Popconfirm, PopconfirmProps, Space, Table } from "antd";
import { DeleteTwoTone, EditTwoTone, ExportOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import AddAuthor from "./add-author";
import EditAuthor from "./edit-author";
import { sendRequest } from "@/utils/api";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import ImportAuthor from "@/app/(public)/admin/author/data/import.auhor";


const CSVLinkNoSSR = dynamic(
    () => import("react-csv").then((mod) => mod.CSVLink),
    { ssr: false }
);

const csvHeaders = [
    { label: "ID", key: "_id" },
    { label: "Tên tác giả", key: "name" },
];


const AuthorTable = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [author, setAuthor] = useState<IAuthorTable[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<IAuthorTable | null>(null);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const pageSize = 5;
    const fetchAuthor = async () => {
        try {
            const res = await sendRequest<IBackendRes<IAuthorTable[]>>({
                url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/author`,
                method: "GET",
            });
            console.log(res.data);
            if (res.data) {
                setAuthor(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {

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
    const handleDeleteAuthor = async (_id: string) => {
        const res = await sendRequest<IBackendRes<IAuthorTable>>({
            url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/author/${_id}`,
            method: "DELETE",
        });
        if (res.data) {
            message.success("Đã xóa tác giả thành công.");
            fetchAuthor();
        } else {
            message.error(res.message);
        }
    };

    const cancel: PopconfirmProps["onCancel"] = (e) => {
        console.log(e);
        message.error("Đã hủy thao tác.");
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
                        placement="left"
                        title="Delete the task"
                        description="Bạn có chắc chắn muốn xóa tác giả này không?"
                        onConfirm={() => handleDeleteAuthor(record._id)}
                        onCancel={cancel}
                        okText="Đồng ý"
                        cancelText="Hủy"
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
                <div className="flex justify-end pb-5 gap-2">
                    <CSVLinkNoSSR
                        headers={csvHeaders}
                        data={author}
                        filename="danh_sach_tac_gia.csv"
                    >
                        <Button icon={<ExportOutlined />} type="primary">
                            Export
                        </Button>
                    </CSVLinkNoSSR>
                    <Button
                        icon={<ImportOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >Import
                    </Button>
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
            <AddAuthor openAdd={openAdd} setOpenAdd={setOpenAdd} onSuccess={fetchAuthor} />

            <EditAuthor
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
                author={selectedAuthor}
                onSuccess={fetchAuthor}
            />
            <ImportAuthor
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                onSuccess={fetchAuthor}
            />
        </div>
    );
};
export default AuthorTable;

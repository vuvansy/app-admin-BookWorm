"use client";
import React, { useState, useCallback, useEffect } from "react";
import {  Button, Tooltip, Popconfirm, Pagination, Table, App } from "antd";;
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import AddGenre from "./add-genre";
import EditGenre from "./edit-genre";
import Image from "next/image";
import { sendRequest } from "@/utils/api";


type GenreData = {
  meta: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
  result: IGenre[];
};

const TableGenre: React.FC = () => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const { message, notification} = App.useApp();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [editingGenre, setEditingGenre] = useState<IGenre | null>(null);


  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    pages: 0,
    total: 0,
  });

    const fetchData = async () => {
      const resGenre = await sendRequest<IBackendRes<GenreData>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/genre`,
        method: "GET",
        queryParams: {
          page: meta.page ,
          limit: meta.limit,
        },
      });
      const resBook = await sendRequest<IBackendRes<IBookTable[]>>({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book`,
        method: "GET",
      });
      if (resGenre.data?.result && resBook.data) {
        const updatedGenres = resGenre.data.result.map((genre) => {
          const count = resBook.data?.filter(
            (book) => book.id_genre?._id === genre._id
          ).length;
          return { ...genre, productCount: count };
        });
        setGenres(updatedGenres);
        setMeta(resGenre.data.meta);
        // console.log("Server meta =>", resGenre.data.meta)
      }
    };

   
  useEffect(() => {
    fetchData();
  }, [meta.page , meta.limit]);
  
  // console.log(meta.page, meta.limit); 
  const showAddModal = () => setIsAddModalVisible(true);
  const hideAddModal = () => setIsAddModalVisible(false);


  const showEditModal = (genre: IGenre) => {
    setEditingGenre(genre);
    setIsEditModalVisible(true);
  };

  
  const hideEditModal = () => {
    setEditingGenre(null);
    setIsEditModalVisible(false);
  };

  const handleAddGenre = useCallback((newGenre: IGenre) => {
    hideAddModal();
    fetchData();
  }, []);

  const handleEditGenre = useCallback((updatedGenre: IGenre) => {
    hideEditModal();
    fetchData();
  }, []);


    const handleDeleteGenre = async (genre: IGenre) => {
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/genre/${genre._id}`,
        method: "DELETE",
      });
      message.success("Xóa danh mục thành công!");
      fetchData(); 
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
      message.error("Xóa danh mục thất bại!");
    }
  };

  const columns: ColumnsType<IGenre> = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (_, record, index) => {
          return <>{index + 1 + (meta.page - 1) * meta.limit}</>;
      },
  },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: 300,
      render: (image) => (
        <div className="flex justify-center">
          <div className="relative w-full h-[80px] max-w-[500px]">
            <Image
              unoptimized
              src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/genre/${image}`}
              alt=""
              className="object-contain"
              fill
            />
          </div>
        </div>
      ),
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 400,
    },
    {
      title: "Sản Phẩm",
      dataIndex: "productCount",
      key: "productCount",
      align: "center",
      width: 200,
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render(_, record) {
        return (
          <div className="flex gap-x-[20px] justify-center">
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer" }}
              onClick={() => showEditModal(record)}
            />
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa danh mục"
              description="Bạn có chắc chắn muốn xóa danh mục này?"
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteGenre(record)}
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-lg px-[15px] pt-4 pb-[10px]">
      <h1 className="text-body-bold uppercase">Quản lý Danh Mục</h1>
      <div className="flex justify-end text-[14px] mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          className="flex items-center"
        >
          Thêm Mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={genres}
        rowKey="_id"
        pagination={{
          current: meta.page ,
          pageSize: meta.limit,
          showSizeChanger: true,
          total: meta.total,
          onChange: (page, pageSize) => 
          setMeta((prev) => ({ ...prev, page, limit: pageSize })),
          showTotal: (total, range) => (
            <div >
            {" "}
            {range[0]}-{range[1]} trên {total} rows
          </div>
          ),
          
        }}
        size="small" 
      />

     <AddGenre visible={isAddModalVisible} onClose={hideAddModal} onAdd={handleAddGenre} />
      {editingGenre && (
        <EditGenre
          visible={isEditModalVisible}
          onClose={hideEditModal}
          onSubmit={handleEditGenre}
          genre={editingGenre}
        />
      )}
    </div>
  );
};

export default TableGenre;

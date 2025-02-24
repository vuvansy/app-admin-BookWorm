"use client";

import React, { useState, useCallback } from "react";
import { Table, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import AddGenre from "./add-genre";
import EditGenre from "./edit-genre";

interface Genre {
  id: number;
  name: string;
  productCount: number;
}

const initialGenres: Genre[] = [
  { id: 1, name: "History", productCount: 1 },
  { id: 2, name: "Science", productCount: 3 },
  { id: 3, name: "Technology", productCount: 5 },
  { id: 4, name: "Novel", productCount: 2 },
  { id: 5, name: "Fantasy", productCount: 4 },
];

const TableGenre: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const showAddModal = () => setIsAddModalVisible(true);
  const hideAddModal = () => setIsAddModalVisible(false);

  const showEditModal = (genre: Genre) => {
    setEditingGenre(genre);
    setIsEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditingGenre(null);
    setIsEditModalVisible(false);
  };

  const getNextId = () => {
    return genres.length > 0 ? Math.max(...genres.map((g) => g.id)) + 1 : 1;
  };

  const handleAddGenre = useCallback((name: string) => {
    const newGenre: Genre = { id: getNextId(), name, productCount: 0 };
    setGenres((prevGenres) => [...prevGenres, newGenre]);
    hideAddModal();
  }, [genres]);

  const handleEditGenre = useCallback((id: number, name: string) => {
    setGenres((prevGenres) =>
      prevGenres.map((genre) => (genre.id === id ? { ...genre, name } : genre))
    );
    hideEditModal();
  }, []);

  const handleDeleteGenre = useCallback((id: number) => {
    setGenres((prevGenres) => prevGenres.filter((genre) => genre.id !== id));
  }, []);

  const columns: ColumnsType<Genre> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_: any, __: any, index: number) => index + 1,
      align: "center",
      width: 100,
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 500,
    },
    {
      title: "Sản Phẩm",
      dataIndex: "productCount",
      key: "productCount",
      align: "left",
      width: 350,
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "left",
      render(_, record) {
        return (
          <div className="flex gap-x-[20px]">
            <EditTwoTone
              twoToneColor="#f57800" style={{ cursor: "pointer" }}
              onClick={() => showEditModal(record)}
            />
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa book"}
              description={"Bạn có chắc chắn muốn xóa danh mục này ?"}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </div>

        )
      }
    },
  ];

  return (
    <div className="bg-white rounded-lg px-[15px] pt-4 pb-[10px]">
      <h1 className="mb-5 text-body-bold uppercase">quản lý danh mục</h1>
      <div className="flex justify-end text-[14px] mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} className="flex items-center">
          Thêm Danh Mục
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={genres}
        rowKey="id"
        pagination={{ pageSize: 4, style: { margin: "10px 0 0 0" } }}
        size="small"
      />
      <AddGenre visible={isAddModalVisible} onClose={hideAddModal} onSubmit={handleAddGenre} />
      {editingGenre && (
        <EditGenre visible={isEditModalVisible} onClose={hideEditModal} onSubmit={handleEditGenre} genre={editingGenre} />
      )}
    </div>
  );
};

export default TableGenre;

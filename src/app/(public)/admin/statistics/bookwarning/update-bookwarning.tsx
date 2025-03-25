"use client";
import React, { useState, useEffect } from "react";
import { Modal, InputNumber, message } from "antd";
import Image from "next/image";

interface UpdateBookWarningProps {
  book: IBookTable | null;
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateBookWarning: React.FC<UpdateBookWarningProps> = ({
  book,
  isVisible,
  onClose,
  onSuccess,
}) => {
  const [newQuantity, setNewQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = async () => {
    if (!book || !book._id) {
      message.error("Không tìm thấy ID sách!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/book/update-quantity/${book._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) throw new Error("Cập nhật thất bại!");
      message.success("Cập nhật số lượng thành công!");
      onSuccess();
      setNewQuantity("");
      onClose();
    } catch (error) {
      message.error("Lỗi khi cập nhật số lượng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập Nhật Số Lượng"
      open={isVisible}
      onCancel={onClose}
      onOk={handleUpdateQuantity}
      confirmLoading={loading}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      {book && (
        <div className="flex flex-col items-center gap-3">
          <Image
            width={100}
            height={100}
            src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/book/${book.image}`}
            alt={book.name}
            className="rounded"
          />
          <p className="text-lg font-semibold">{book.name}</p>
          <p className="text-sm text-gray-600">
            Số lượng hiện có: <strong>{book.quantity}</strong>
          </p>
          <InputNumber
            value={newQuantity}
            onChange={(value) => {
              if (typeof value === "number") {
                setNewQuantity(value);
              }
            }}
            className="w-full"
          />
        </div>
      )}
    </Modal>
  );
};

export default UpdateBookWarning;

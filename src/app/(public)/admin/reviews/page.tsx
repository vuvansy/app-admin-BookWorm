"use client";

import React from "react";
import TableFeedback from "./table-feedback";

const page: React.FC = () => {
  const feedbackData = [
    {
      key: "1",
      image: "/product.webp",
      name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
      rating: 5,
    },
    {
      key: "2",
      image: "/product.webp",
      name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
      rating: 4,
    },
    {
      key: "3",
      image: "/product.webp",
      name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
      rating: 5,
    },
  ];

  return (
    <div>
      <TableFeedback data={feedbackData} />
    </div>
  );
};

export default page;

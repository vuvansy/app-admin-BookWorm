import TableBookWarning from "./table-bookwarning";

const ProductsWarningPage: React.FC = () => {
  const warningData = [
    {
      key: "1",
      image: "/product.webp",
      name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
      quantity: 5,
    },
    {
      key: "2",
      image: "/product.webp",
      name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
      quantity: 2,
    },
    {
      key: "3",
      image: "/product.webp",
      name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
      quantity: 5,
    },
    {
      key: "4",
      image: "/product.webp",
      name: "Nhóc Miko! Cô Bé Nhí Nhảnh - Tập 38",
      quantity: 7,
    },
  ];

  return (
    <div>
      <TableBookWarning data={warningData} />
    </div>
  );
};

export default ProductsWarningPage;

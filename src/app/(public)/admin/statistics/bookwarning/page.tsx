import { sendRequest } from "@/utils/api";
import TableBookWarning from "./table-bookwarning";

const ProductsWarningPage: React.FC = async () => {
  const warningData = await sendRequest<{ data: IBookTable[] }>({
    url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/books/low-stock`,
    method: "GET",
  });
  const books = Array.isArray(warningData.data) ? warningData.data : [];

  return (
    <div>
      <TableBookWarning data={books} />
    </div>
  );
};

export default ProductsWarningPage;

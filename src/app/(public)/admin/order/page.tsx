import TableOrders from "./table-orders"

const OrderPage = () => {

    return (
        <div className="rounded border bg-white p-[15px]">
            <h2 className="text-body-bold uppercase pb-1">Danh sách đơn hàng</h2>
           <TableOrders/>
        </div>
    )
}

export default OrderPage
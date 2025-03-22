
import Statistical from "@/components/dashboard/statistical";
import CustomerNew from "@/components/dashboard/customer-new";
import TableOrderWait from "@/components/dashboard/table-order-wait";
import MetricsOverview from "@/components/dashboard/metrics-overview";

const HomePage = () => {

  return (
    <>
      <MetricsOverview />
      <TableOrderWait />
      <div className="flex justify-between gap-x-[15px]">
        <Statistical />
        <CustomerNew />
      </div>
    </>
  )
}

export default HomePage



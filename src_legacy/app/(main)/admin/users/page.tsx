import { CustomerTable } from "./_components/customer-table";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-[1/4]">
        <CustomerTable />
      </div>
    </div>
  );
}

import SalesChart from "@/_components/admin/SalesChart";

export default function AdminSalesPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6">매출 통계</h1>
      <SalesChart />
    </main>
  );
}

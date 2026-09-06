import { getDashboardMetrics } from "@/features/dashboard/actions";
import { formatCurrency } from "@/lib/utils";
import { Users, FileText, CalendarDays, IndianRupee } from "lucide-react";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  const statCards = [
    { name: "Total Enquiries", value: metrics.enquiries, icon: Users, color: "text-blue-500" },
    { name: "Active Quotes", value: metrics.quotations, icon: FileText, color: "text-amber-500" },
    { name: "Confirmed Bookings", value: metrics.bookings, icon: CalendarDays, color: "text-emerald-500" },
    { name: "Confirmed Revenue", value: formatCurrency(Number(metrics.revenue)), icon: IndianRupee, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Dashboard</h1>
          <p className="text-on-surface-variant">Overview of your business operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="p-6 border border-outline/20 rounded-lg bg-surface-container-low/30 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-surface-container ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface-variant">{stat.name}</p>
              <p className="text-2xl font-semibold text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

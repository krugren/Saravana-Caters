import { getIntelligenceData } from "@/features/intelligence/actions";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp, IndianRupee, CalendarDays, Users,
  FileText, AlertTriangle, BarChart3,
} from "lucide-react";

function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-surface-container-low/40 border border-outline/20 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>
        <p className="text-2xl font-semibold text-on-surface leading-tight">{value}</p>
        {sub && <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function CssBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-on-surface-variant w-20 shrink-0 text-right">{label}</span>
      <div className="flex-1 bg-surface-container rounded-full h-5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color} flex items-center justify-end pr-2`}
          style={{ width: `${Math.max(pct, 3)}%` }}
        >
          <span className="text-xs font-semibold text-white">{value}</span>
        </div>
      </div>
    </div>
  );
}

export default async function IntelligencePage() {
  const data = await getIntelligenceData();
  const { summary, monthlyData, eventTypeBreakdown, lowStock, recentBookings } = data;

  const maxMonthlyRevenue = Math.max(...monthlyData.map((m) => Number(m.revenue ?? 0)), 1);
  const maxEventCount = Math.max(...eventTypeBreakdown.map((e) => Number(e.count ?? 0)), 1);

  const conversionRate = summary.totalEnquiries > 0
    ? Math.round((summary.totalBookings / summary.totalEnquiries) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-on-surface flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" /> Intelligence
        </h1>
        <p className="text-on-surface-variant mt-1">Live analytics from your operations data.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Total Revenue" value={formatCurrency(summary.totalRevenue)}
          sub={`Collected: ${formatCurrency(summary.totalCollected)}`}
          icon={IndianRupee} color="bg-primary/10 text-primary" />
        <KpiCard label="Outstanding Balance" value={formatCurrency(summary.outstandingBalance)}
          sub="Across all bookings"
          icon={AlertTriangle} color="bg-red-50 text-red-500" />
        <KpiCard label="Total Bookings" value={String(summary.totalBookings)}
          sub={`${conversionRate}% conversion from enquiries`}
          icon={CalendarDays} color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Total Enquiries" value={String(summary.totalEnquiries)}
          icon={Users} color="bg-blue-50 text-blue-600" />
        <KpiCard label="Quotations Issued" value={String(summary.totalQuotations)}
          icon={FileText} color="bg-violet-50 text-violet-600" />
        <KpiCard label="Avg Booking Value" value={
          summary.totalBookings > 0
            ? formatCurrency(summary.totalRevenue / summary.totalBookings)
            : "—"
        }
          icon={TrendingUp} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-6">
          <h2 className="font-semibold text-on-surface mb-1">Monthly Event Revenue</h2>
          <p className="text-xs text-on-surface-variant mb-5">By event date (last 6 months)</p>
          {monthlyData.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {monthlyData.map((m) => (
                <CssBar
                  key={m.month}
                  label={m.month}
                  value={Number(m.count)}
                  max={Math.max(...monthlyData.map((x) => Number(x.count)), 1)}
                  color="bg-primary"
                />
              ))}
            </div>
          )}
        </div>

        {/* Event Type Breakdown */}
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-6">
          <h2 className="font-semibold text-on-surface mb-1">Bookings by Event Type</h2>
          <p className="text-xs text-on-surface-variant mb-5">All-time breakdown</p>
          {eventTypeBreakdown.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {eventTypeBreakdown.map((e) => (
                <CssBar
                  key={e.eventType}
                  label={e.eventType?.replace("_", " ") ?? "OTHER"}
                  value={Number(e.count)}
                  max={maxEventCount}
                  color="bg-forest-green"
                />
              ))}
            </div>
          )}
        </div>

        {/* Lead Funnel */}
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-6">
          <h2 className="font-semibold text-on-surface mb-1">Lead Conversion Funnel</h2>
          <p className="text-xs text-on-surface-variant mb-5">Enquiries → Quotations → Bookings</p>
          <div className="space-y-3">
            <CssBar label="Enquiries" value={summary.totalEnquiries}
              max={Math.max(summary.totalEnquiries, 1)} color="bg-blue-500" />
            <CssBar label="Quotations" value={summary.totalQuotations}
              max={Math.max(summary.totalEnquiries, 1)} color="bg-violet-500" />
            <CssBar label="Bookings" value={summary.totalBookings}
              max={Math.max(summary.totalEnquiries, 1)} color="bg-emerald-600" />
          </div>
          <div className="mt-4 pt-4 border-t border-outline/10 flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Conversion Rate</span>
            <span className="text-2xl font-bold text-primary">{conversionRate}%</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-6">
          <h2 className="font-semibold text-on-surface mb-1">Inventory Status</h2>
          <p className="text-xs text-on-surface-variant mb-5">All ingredients tracked</p>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-on-surface-variant">All stock levels look good!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStock.map((ing) => (
                <div key={ing.id} className="flex items-center justify-between px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-on-surface">{ing.name}</span>
                    <span className="text-xs text-on-surface-variant ml-2">({ing.category})</span>
                  </div>
                  <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {Number(ing.currentStock).toFixed(1)} / {ing.minThreshold} {ing.unit} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-6">
          <h2 className="font-semibold text-on-surface mb-4">Recent Bookings</h2>
          <div className="space-y-2">
            {recentBookings.map(({ booking, customer }) => (
              <div key={booking.id} className="flex items-center justify-between px-4 py-3 bg-surface rounded-lg border border-outline/10">
                <div>
                  <span className="text-sm font-medium text-on-surface">{customer?.name ?? "—"}</span>
                  <span className="text-xs text-on-surface-variant ml-3">{booking.eventType.replace("_", " ")} · {booking.eventDate}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-primary">{formatCurrency(Number(booking.totalValue))}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700"
                    : booking.status === "COMPLETED" ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                  }`}>{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { getQuotation, updateQuotationStatus } from "@/features/quotations/actions";
import { convertQuotationToBooking } from "@/features/bookings/actions";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, User, CalendarDays, Users, MapPin, IndianRupee } from "lucide-react";
import Link from "next/link";
import QuotationDetailClient from "./quotation-detail-client";

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getQuotation(id);
  if (!data) notFound();

  const { quotation, customer, lineItems } = data;

  const STATUS_COLORS: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
    SENT: "bg-blue-100 text-blue-700 border-blue-200",
    ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    EXPIRED: "bg-amber-100 text-amber-700 border-amber-200",
  };

  // Split line items: pricing lines (sortOrder < 99) vs dish lines (sortOrder 99)
  const pricingItems = lineItems.filter((li) => (li.sortOrder ?? 99) < 99);
  const dishItems = lineItems.filter((li) => (li.sortOrder ?? 0) >= 99);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/quotations" className="text-on-surface-variant hover:text-on-surface transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-semibold text-on-surface">{quotation.quotationNumber}</h1>
              <Badge className={`border ${STATUS_COLORS[quotation.status] ?? ""}`}>{quotation.status}</Badge>
            </div>
            <p className="text-on-surface-variant text-sm mt-1">Created {formatDateTime(quotation.createdAt)}</p>
          </div>
        </div>
        <QuotationDetailClient quotation={quotation} />
      </div>

      {/* Event + Customer Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide flex items-center gap-2">
            <User className="w-4 h-4" /> Customer
          </h2>
          <div>
            <p className="font-semibold text-on-surface text-lg">{customer?.name ?? "—"}</p>
            <p className="text-sm text-on-surface-variant">{customer?.phone}</p>
            <p className="text-sm text-on-surface-variant">{customer?.email}</p>
          </div>
        </div>
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Event Details
          </h2>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
              <span className="text-on-surface font-medium">{quotation.eventType.replace("_", " ")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
              <span className="text-on-surface">{formatDate(quotation.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
              <span className="text-on-surface">{quotation.guests} guests</span>
            </div>
            {quotation.venue && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                <span className="text-on-surface">{quotation.venue}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline/10 flex items-center justify-between">
          <h2 className="font-semibold text-on-surface flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-primary" /> Pricing Breakdown
          </h2>
        </div>
        <Table>
          <TableHeader className="bg-surface-container">
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="text-right">Rate (₹)</TableHead>
              <TableHead className="text-right">Total (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                <TableCell className="font-medium text-on-surface">{item.name}</TableCell>
                <TableCell className="text-right text-on-surface-variant">{item.quantity}</TableCell>
                <TableCell className="text-right text-on-surface-variant">{item.unit}</TableCell>
                <TableCell className="text-right">{formatCurrency(Number(item.rate))}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(Number(item.total))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="border-t border-outline/10 p-5">
          <div className="flex flex-col items-end gap-2 max-w-xs ml-auto text-sm">
            <div className="flex justify-between w-full text-on-surface-variant">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(quotation.subtotal))}</span>
            </div>
            {Number(quotation.discountAmount ?? 0) > 0 && (
              <div className="flex justify-between w-full text-emerald-600">
                <span>Discount ({quotation.discountPercent}%)</span>
                <span>− {formatCurrency(Number(quotation.discountAmount))}</span>
              </div>
            )}
            <div className="flex justify-between w-full text-on-surface-variant">
              <span>GST ({quotation.gstPercent}%)</span>
              <span>+ {formatCurrency(Number(quotation.gstAmount))}</span>
            </div>
            <div className="flex justify-between w-full text-lg font-bold text-on-surface border-t border-outline/20 pt-2 mt-1">
              <span>Grand Total</span>
              <span className="text-primary">{formatCurrency(Number(quotation.grandTotal))}</span>
            </div>
            <div className="flex justify-between w-full text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
              <span>Advance Required ({quotation.gstPercent}%)</span>
              <span className="font-semibold">{formatCurrency(Number(quotation.advanceRequired))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dish Selection */}
      {dishItems.length > 0 && (
        <div className="border border-outline/20 rounded-xl bg-surface-container-low/30 p-5">
          <h2 className="font-semibold text-on-surface mb-3">Selected Menu Items ({dishItems.length})</h2>
          <div className="flex flex-wrap gap-2">
            {dishItems.map((item) => (
              <Badge key={item.id} variant="outline" className="bg-surface border-outline/30 text-on-surface">
                {item.name}
                {item.category && <span className="text-on-surface-variant ml-1">· {item.category}</span>}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

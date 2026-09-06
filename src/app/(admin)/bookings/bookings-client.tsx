"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, IndianRupee, TrendingUp, CalendarDays, AlertCircle } from "lucide-react";
import { updateBookingStatus, recordPayment, deleteBooking } from "@/features/bookings/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Booking = {
  id: string; quotationId: string; customerId: string; status: string;
  eventType: string; eventDate: string; venue: string | null;
  totalValue: number; advancePaid: number | null; balanceDue: number;
  notes: string | null; createdAt: string; updatedAt: string;
};
type Customer = { id: string; name: string; phone: string } | null;
type Quotation = { id: string; quotationNumber: string } | null;
type BookingRow = { booking: Booking; customer: Customer; quotation: Quotation };

const STATUS_OPTIONS = ["TENTATIVE", "CONFIRMED", "COMPLETED", "CANCELLED"];
const STATUS_COLORS: Record<string, string> = {
  TENTATIVE: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

function PaymentDialog({ booking, onDone }: { booking: Booking; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await recordPayment(booking.id, Number(amount));
        setOpen(false);
        onDone();
        router.refresh();
        toast.success(`Payment of ₹${amount} recorded`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to record payment");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
          <IndianRupee className="w-3.5 h-3.5 mr-1" /> Pay
        </Button>
      } />
      <DialogContent showCloseButton={false} className="max-w-sm bg-surface p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <DialogTitle className="text-lg font-display font-semibold text-on-surface">Record Payment</DialogTitle>
            <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
          </div>
          <DialogDescription className="text-sm text-on-surface-variant mb-4">
            Balance due: <strong>{formatCurrency(Number(booking.balanceDue))}</strong>
          </DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Amount Received (₹)</label>
              <input type="number" min={1} max={booking.balanceDue} value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="flex gap-3 justify-end">
              <DialogClose render={<button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>} />
              <button type="submit" disabled={isPending || amount <= 0}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                {isPending ? "Saving…" : "Record Payment"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BookingsClient({ bookingsList }: { bookingsList: BookingRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalRevenue = bookingsList.reduce((s, { booking }) => s + Number(booking.totalValue), 0);
  const totalBalance = bookingsList.reduce((s, { booking }) => s + Number(booking.balanceDue), 0);
  const upcoming = bookingsList.filter(({ booking }) =>
    ["TENTATIVE", "CONFIRMED"].includes(booking.status)
  ).length;

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      try {
        await updateBookingStatus(id, status);
        router.refresh();
        toast.success(`Status updated to ${status}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteBooking(id);
        router.refresh();
        toast.success("Booking deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete booking");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold text-on-surface">Bookings</h1>
        <p className="text-on-surface-variant">Confirmed events, payment tracking, and status management.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-container-low/40 border border-outline/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Upcoming Events</p>
            <p className="text-2xl font-semibold text-on-surface">{upcoming}</p>
          </div>
        </div>
        <div className="bg-surface-container-low/40 border border-outline/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Total Revenue</p>
            <p className="text-2xl font-semibold text-on-surface">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-surface-container-low/40 border border-outline/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Outstanding Balance</p>
            <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      </div>

      <div className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-container">
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Advance Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingsList.map(({ booking, customer, quotation }) => (
              <TableRow key={booking.id} className="hover:bg-surface-container-low transition-colors">
                <TableCell>
                  <div className="font-medium text-on-surface">{formatDate(booking.eventDate)}</div>
                  <div className="text-xs text-on-surface-variant">{booking.eventType.replace("_", " ")}</div>
                  {booking.venue && <div className="text-xs text-on-surface-variant">{booking.venue}</div>}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-on-surface">{customer?.name ?? "—"}</div>
                  <div className="text-xs text-on-surface-variant">{customer?.phone}</div>
                </TableCell>
                <TableCell className="text-sm font-mono text-primary">{quotation?.quotationNumber ?? "—"}</TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(booking.totalValue))}</TableCell>
                <TableCell className="text-emerald-600">{formatCurrency(Number(booking.advancePaid ?? 0))}</TableCell>
                <TableCell className={Number(booking.balanceDue) > 0 ? "font-semibold text-red-600" : "text-emerald-600"}>
                  {formatCurrency(Number(booking.balanceDue))}
                </TableCell>
                <TableCell>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    disabled={isPending}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${STATUS_COLORS[booking.status] ?? ""}`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end items-center">
                    {Number(booking.balanceDue) > 0 && (
                      <PaymentDialog booking={booking} onDone={() => {}} />
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleDelete(booking.id)} disabled={isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {bookingsList.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-on-surface-variant">
                  No bookings yet. Confirm a quotation from the <a href="/quotations" className="text-primary underline">Quotations</a> page.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

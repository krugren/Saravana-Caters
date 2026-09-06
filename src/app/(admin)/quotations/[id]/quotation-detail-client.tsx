"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Send, RotateCcw } from "lucide-react";
import { updateQuotationStatus } from "@/features/quotations/actions";
import { convertQuotationToBooking } from "@/features/bookings/actions";
import { toast } from "sonner";

type Quotation = {
  id: string; status: string; grandTotal: number; quotationNumber: string;
};

export default function QuotationDetailClient({ quotation }: { quotation: Quotation }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [advancePaid, setAdvancePaid] = useState(0);

  function handleStatusUpdate(status: string) {
    startTransition(async () => {
      try {
        await updateQuotationStatus(quotation.id, status);
        router.refresh();
        toast.success(`Quotation marked as ${status}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  function handleConfirmBooking(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await convertQuotationToBooking(quotation.id, Number(advancePaid));
        toast.success(`Booking created! Kitchen plan and task auto-generated.`);
        setConfirmOpen(false);
        router.push("/bookings");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to confirm booking");
      }
    });
  }

  const isDraft = quotation.status === "DRAFT";
  const isSent = quotation.status === "SENT";
  const isAccepted = quotation.status === "ACCEPTED";
  const isTerminal = ["REJECTED", "EXPIRED"].includes(quotation.status);

  return (
    <div className="flex gap-2 flex-wrap justify-end">
      {isDraft && (
        <Button variant="outline" onClick={() => handleStatusUpdate("SENT")} disabled={isPending}
          className="border-blue-200 text-blue-700 hover:bg-blue-50">
          <Send className="w-4 h-4 mr-2" /> Mark as Sent
        </Button>
      )}
      {(isDraft || isSent) && (
        <Button variant="outline" onClick={() => handleStatusUpdate("REJECTED")} disabled={isPending}
          className="border-red-200 text-red-600 hover:bg-red-50">
          Reject
        </Button>
      )}
      {isSent && !isAccepted && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger render={
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPending}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Booking
            </Button>
          } />
          <DialogContent showCloseButton={false} className="max-w-sm bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-lg font-display font-semibold text-on-surface">Confirm Booking</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">
                This will convert <strong>{quotation.quotationNumber}</strong> into a confirmed booking and auto-generate a Kitchen Plan and Task.
              </DialogDescription>
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Advance Received (₹)
                  </label>
                  <input
                    type="number" min={0} max={quotation.grandTotal}
                    value={advancePaid} onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Grand Total: ₹{Number(quotation.grandTotal).toLocaleString()}</p>
                </div>
                <div className="flex gap-3 justify-end pt-1">
                  <DialogClose render={
                    <button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">
                      Cancel
                    </button>
                  } />
                  <button type="submit" disabled={isPending}
                    className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                    {isPending ? "Confirming…" : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {isTerminal && (
        <Button variant="outline" onClick={() => handleStatusUpdate("DRAFT")} disabled={isPending}
          className="border-outline/40 text-on-surface-variant hover:bg-surface-container">
          <RotateCcw className="w-4 h-4 mr-2" /> Reopen as Draft
        </Button>
      )}
    </div>
  );
}

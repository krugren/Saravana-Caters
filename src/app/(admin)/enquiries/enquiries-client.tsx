"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { createEnquiry, deleteEnquiry } from "@/features/crm/actions";
import { formatDateTime, formatDate } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

type EnquiryRow = {
  enquiry: {
    id: string; customerId: string | null; eventType: string;
    expectedGuests: number | null; eventDate: string | null;
    status: string; source: string; createdAt: string; updatedAt: string;
  };
  customer: { id: string; name: string; phone: string | null } | null;
};

const EVENT_TYPES = ["WEDDING", "BIRTHDAY", "CORPORATE", "ANNIVERSARY", "ENGAGEMENT", "OTHER"];
const SOURCES = ["WALK_IN", "PHONE", "REFERRAL", "INSTAGRAM", "WHATSAPP", "OTHER"];

export default function EnquiriesClient({ enquiriesList }: { enquiriesList: EnquiryRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    customerName: "", phone: "", eventType: "WEDDING",
    expectedGuests: 100, source: "PHONE", eventDate: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "expectedGuests" ? Number(value) : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createEnquiry(form);
        setOpen(false);
        setForm({ customerName: "", phone: "", eventType: "WEDDING", expectedGuests: 100, source: "PHONE", eventDate: "" });
        router.refresh();
        toast.success("Enquiry created successfully");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create enquiry");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    startTransition(async () => {
      try {
        await deleteEnquiry(id);
        router.refresh();
        toast.success("Enquiry deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete enquiry");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Enquiries</h1>
          <p className="text-on-surface-variant">Manage incoming event requests and leads.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> New Enquiry
            </Button>
          } />
          <DialogContent showCloseButton={false} className="max-w-lg bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-xl font-display font-semibold text-on-surface">New Enquiry</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">
                Fill in the customer and event details below.
              </DialogDescription>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Customer Name *</label>
                    <input name="customerName" value={form.customerName} onChange={handleChange} required
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Expected Guests</label>
                    <input name="expectedGuests" type="number" min={1} value={form.expectedGuests} onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Event Type</label>
                    <select name="eventType" value={form.eventType} onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      {EVENT_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Event Date</label>
                    <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Source</label>
                    <select name="source" value={form.source} onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      {SOURCES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <DialogClose render={
                    <button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>
                  } />
                  <button type="submit" disabled={isPending}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                    {isPending ? "Saving…" : "Create Enquiry"}
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-container">
            <TableRow>
              <TableHead>Date</TableHead><TableHead>Customer</TableHead>
              <TableHead>Event Type</TableHead><TableHead>Event Date</TableHead>
              <TableHead>Guests</TableHead><TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiriesList.map(({ enquiry, customer }) => (
              <TableRow key={enquiry.id} className="hover:bg-surface-container-low transition-colors">
                <TableCell className="text-on-surface-variant text-sm">{formatDateTime(enquiry.createdAt)}</TableCell>
                <TableCell className="font-medium text-on-surface">
                  {customer?.name}
                  <div className="text-xs text-on-surface-variant">{customer?.phone}</div>
                </TableCell>
                <TableCell>{enquiry.eventType.replace("_", " ")}</TableCell>
                <TableCell>{enquiry.eventDate ? formatDate(enquiry.eventDate) : "TBD"}</TableCell>
                <TableCell>{enquiry.expectedGuests || "TBD"}</TableCell>
                <TableCell>
                  <Badge variant={enquiry.status === "NEW" ? "default" : "secondary"}>{enquiry.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/quotations/new?enquiryId=${enquiry.id}`}>
                      <Button variant="outline" size="sm" className="border-outline/50">Quote</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(enquiry.id)} disabled={isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {enquiriesList.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-on-surface-variant">
                  No enquiries yet. Click <span className="font-medium text-primary">+ New Enquiry</span> to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

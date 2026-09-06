"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Star, CheckCircle2, Clock, Globe, Shield } from "lucide-react";
import { createTestimonial, updateTestimonial, deleteTestimonial, approveTestimonial } from "@/features/testimonials/actions";
import { toast } from "sonner";

type Testimonial = {
  id: string; quote: string; name: string; detail: string;
  initials: string; sortOrder: number; isActive: boolean | null;
  editToken: string | null; createdAt: string; updatedAt: string;
};

type Tab = "all" | "pending" | "live";

const EMPTY = { quote: "", name: "", detail: "", initials: "", sortOrder: 0, isActive: true };

/** A review submitted via the public form has an editToken set */
const isPublicSubmission = (t: Testimonial) => !!t.editToken;
const isPending          = (t: Testimonial) => t.isActive === false && isPublicSubmission(t);
const isLive             = (t: Testimonial) => t.isActive === true;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function TestimonialsClient({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [isPendingTransition, startTransition] = useTransition();
  const [addOpen,   setAddOpen]   = useState(false);
  const [editOpen,  setEditOpen]  = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const pendingCount = testimonials.filter(isPending).length;

  const displayed = testimonials.filter((t) => {
    if (activeTab === "pending") return isPending(t);
    if (activeTab === "live")    return isLive(t);
    return true;
  });

  function openAdd()  { setForm(EMPTY); setAddOpen(true); }
  function openEdit(t: Testimonial) {
    setForm({ quote: t.quote, name: t.name, detail: t.detail, initials: t.initials, sortOrder: t.sortOrder, isActive: t.isActive !== false });
    setEditingId(t.id);
    setEditOpen(true);
  }

  function handleSubmit(mode: "add" | "edit") {
    return (e: React.FormEvent) => {
      e.preventDefault();
      startTransition(async () => {
        try {
          if (mode === "add") {
            await createTestimonial(form);
            setAddOpen(false);
            toast.success("Testimonial added — website updated");
          } else if (editingId) {
            await updateTestimonial(editingId, form);
            setEditOpen(false);
            toast.success("Testimonial updated — website updated");
          }
          router.refresh();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed");
        }
      });
    };
  }

  function handleApprove(t: Testimonial) {
    startTransition(async () => {
      try {
        await approveTestimonial(t.id);
        router.refresh();
        toast.success(`"${t.name}'s" review is now live on the website ✓`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete testimonial from ${name}? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteTestimonial(id);
        router.refresh();
        toast.success("Testimonial deleted — website updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed");
      }
    });
  }

  function FormFields() {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Quote *</label>
          <textarea value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} required rows={4}
            placeholder="Customer's review in their own words…"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Customer Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
              placeholder="e.g. Rajasekaran M."
              className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Initials (auto)</label>
            <input value={form.initials} onChange={e => setForm(p => ({ ...p, initials: e.target.value }))}
              placeholder="e.g. RM"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Event Detail</label>
          <input value={form.detail} onChange={e => setForm(p => ({ ...p, detail: e.target.value }))}
            placeholder="e.g. Wedding · 450 guests · Erode"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="grid grid-cols-2 gap-3 items-center">
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex items-center gap-3 mt-5">
            <input type="checkbox" id="tActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
            <label htmlFor="tActive" className="text-sm text-on-surface">Show on website</label>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <DialogClose render={<button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>} />
          <button type="submit" disabled={isPendingTransition} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
            {isPendingTransition ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Testimonials</h1>
          <p className="text-on-surface-variant mt-1">Customer reviews shown on the public website.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Testimonial</Button>} />
          <DialogContent showCloseButton={false} className="max-w-lg bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-xl font-display font-semibold text-on-surface">Add Testimonial</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">New testimonial will appear in the homepage carousel.</DialogDescription>
              <form onSubmit={handleSubmit("add")}><FormFields /></form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Pending alert banner ─────────────────────────── */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {pendingCount} review{pendingCount > 1 ? "s" : ""} waiting for your approval
            </p>
            <p className="text-xs text-amber-600">
              Submitted by visitors on the public website. Review each one and approve or delete.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("pending")}
            className="text-xs font-bold text-amber-700 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors shrink-0"
          >
            View Pending
          </button>
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-outline/20">
        {(
          [
            { key: "all"     as Tab, label: "All",                  count: testimonials.length,              urgent: false },
            { key: "pending" as Tab, label: "Pending from Website", count: pendingCount,                     urgent: pendingCount > 0 },
            { key: "live"    as Tab, label: "Live",                 count: testimonials.filter(isLive).length, urgent: false },
          ] satisfies { key: Tab; label: string; count: number; urgent: boolean }[]
        ).map(({ key, label, count, urgent }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              urgent && activeTab !== key
                ? "bg-amber-500 text-white"
                : activeTab === key
                ? "bg-primary/10 text-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Edit dialog ──────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent showCloseButton={false} className="max-w-lg bg-surface p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <DialogTitle className="text-xl font-display font-semibold text-on-surface">Edit Testimonial</DialogTitle>
              <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg">&times;</button>} />
            </div>
            <DialogDescription className="text-sm text-on-surface-variant mb-5">Changes will update the public homepage.</DialogDescription>
            <form onSubmit={handleSubmit("edit")}><FormFields /></form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-container">
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((t) => (
              <TableRow
                key={t.id}
                className={`hover:bg-surface-container-low transition-colors ${isPending(t) ? "bg-amber-50/40" : ""}`}
              >
                <TableCell className="text-xs text-on-surface-variant">{t.sortOrder}</TableCell>

                {/* Review text */}
                <TableCell className="max-w-xs">
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface line-clamp-2 italic">"{t.quote}"</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{formatDate(t.createdAt)}</p>
                </TableCell>

                {/* Customer */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {t.initials}
                    </div>
                    <span className="text-sm font-medium text-on-surface">{t.name}</span>
                  </div>
                </TableCell>

                {/* Event */}
                <TableCell className="text-xs text-on-surface-variant">{t.detail || "—"}</TableCell>

                {/* Source */}
                <TableCell>
                  {isPublicSubmission(t) ? (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Globe className="w-3 h-3" />
                      <span>Website</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                      <Shield className="w-3 h-3" />
                      <span>Admin</span>
                    </div>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {isPending(t) ? (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </Badge>
                  ) : t.isActive !== false ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Hidden</Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {/* One-click approve (only for pending public submissions) */}
                    {isPending(t) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(t)}
                        disabled={isPendingTransition}
                        className="border-green-300 text-green-700 hover:bg-green-50 gap-1"
                        title="Approve and publish to website"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                    )}
                    <Button
                      variant="outline" size="sm"
                      onClick={() => openEdit(t)}
                      disabled={isPendingTransition}
                      className="border-outline/40 text-on-surface-variant hover:bg-surface-container"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      onClick={() => handleDelete(t.id, t.name)}
                      disabled={isPendingTransition}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {displayed.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-on-surface-variant">
                  {activeTab === "pending"
                    ? "No pending reviews — you're all caught up! 🎉"
                    : activeTab === "live"
                    ? "No live testimonials yet."
                    : "No testimonials. Add your first one!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

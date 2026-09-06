"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { createCustomer, deleteCustomer } from "@/features/crm/actions";
import Link from "next/link";
import { toast } from "sonner";

type Customer = {
  id: string; name: string; phone: string; email: string | null;
  address: string | null; createdAt: string; updatedAt: string;
};

export default function CustomersClient({ customersList }: { customersList: Customer[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createCustomer(form);
        setOpen(false);
        setForm({ name: "", phone: "", email: "", address: "" });
        router.refresh();
        toast.success("Customer added successfully");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add customer");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this customer?")) return;
    startTransition(async () => {
      try {
        await deleteCustomer(id);
        router.refresh();
        toast.success("Customer deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete customer");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Customers</h1>
          <p className="text-on-surface-variant">Manage your client directory.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Customer
            </Button>
          } />
          <DialogContent showCloseButton={false} className="max-w-lg bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-xl font-display font-semibold text-on-surface">Add Customer</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">
                Add a new client to your directory.
              </DialogDescription>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Address</label>
                    <input name="address" value={form.address} onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <DialogClose render={
                    <button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>
                  } />
                  <button type="submit" disabled={isPending}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                    {isPending ? "Saving…" : "Add Customer"}
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
              <TableHead>Name</TableHead><TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customersList.map((c) => (
              <TableRow key={c.id} className="hover:bg-surface-container-low transition-colors">
                <TableCell className="font-medium text-on-surface">{c.name}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    {c.phone && <div className="flex items-center gap-1.5 text-sm text-on-surface-variant"><Phone className="w-3.5 h-3.5" />{c.phone}</div>}
                    {c.email && <div className="flex items-center gap-1.5 text-sm text-on-surface-variant"><Mail className="w-3.5 h-3.5" />{c.email}</div>}
                    {!c.phone && !c.email && <span className="text-on-surface-variant/50">—</span>}
                  </div>
                </TableCell>
                <TableCell>
                  {c.address
                    ? <div className="flex items-center gap-1.5 text-sm text-on-surface-variant"><MapPin className="w-3.5 h-3.5 shrink-0" />{c.address}</div>
                    : <span className="text-on-surface-variant/50">—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/enquiries?customerId=${c.id}`}>
                      <Button variant="outline" size="sm" className="border-outline/50">Enquiries</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)} disabled={isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {customersList.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-on-surface-variant">
                  No customers yet. Click <span className="font-medium text-primary">+ Add Customer</span> to begin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

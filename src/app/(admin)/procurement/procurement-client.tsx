"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, PackagePlus, TrendingDown } from "lucide-react";
import { createStockIn, deleteStockMovement } from "@/features/inventory/actions";
import { formatDateTime } from "@/lib/utils";

type Movement = {
  movement: { id: string; type: string; quantity: number; reason: string | null; createdAt: string };
  ingredient: { id: string; name: string; unit: string; category: string; minThreshold: number | null } | null;
  supplier: { id: string; name: string } | null;
};
type Ingredient = { id: string; name: string; unit: string };
type Supplier = { id: string; name: string };

export default function ProcurementClient({
  movements, ingredients, suppliers,
}: {
  movements: Movement[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ ingredientId: "", supplierId: "", quantity: 1, reason: "Purchase" });

  const inCount = movements.filter((m) => m.movement.type === "IN").length;
  const outCount = movements.filter((m) => m.movement.type === "OUT").length;
  const selectedIngredient = ingredients.find((i) => i.id === form.ingredientId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.ingredientId) return;
    startTransition(async () => {
      await createStockIn({
        ingredientId: form.ingredientId,
        supplierId: form.supplierId || undefined,
        quantity: Number(form.quantity),
        reason: form.reason,
      });
      setOpen(false);
      setForm({ ingredientId: "", supplierId: "", quantity: 1, reason: "Purchase" });
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this stock entry?")) return;
    startTransition(async () => { await deleteStockMovement(id); router.refresh(); });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Procurement</h1>
          <p className="text-on-surface-variant">Track stock-in entries and raw material purchases.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Stock In
            </Button>
          } />
          <DialogContent showCloseButton={false} className="max-w-md bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-xl font-display font-semibold text-on-surface">Record Stock In</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">
                Record a new stock purchase or delivery.
              </DialogDescription>
              {ingredients.length === 0 ? (
                <div className="text-center py-6 text-on-surface-variant text-sm">
                  No ingredients found.{" "}
                  <a href="/inventory" className="text-primary underline">Add ingredients first →</a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Ingredient *</label>
                    <select value={form.ingredientId} onChange={(e) => setForm((p) => ({ ...p, ingredientId: e.target.value }))} required
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="">Select ingredient…</option>
                      {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                        Qty {selectedIngredient ? `(${selectedIngredient.unit})` : ""}
                      </label>
                      <input type="number" min={0.01} step={0.01} value={form.quantity}
                        onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Supplier</label>
                      <select value={form.supplierId} onChange={(e) => setForm((p) => ({ ...p, supplierId: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">None / Walk-in</option>
                        {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Reason / Notes</label>
                    <input value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <DialogClose render={<button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>} />
                    <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                      {isPending ? "Saving…" : "Record Entry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low/40 border border-outline/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <PackagePlus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Stock In Entries</p>
            <p className="text-2xl font-semibold text-on-surface">{inCount}</p>
          </div>
        </div>
        <div className="bg-surface-container-low/40 border border-outline/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Stock Out Entries</p>
            <p className="text-2xl font-semibold text-on-surface">{outCount}</p>
          </div>
        </div>
      </div>

      <div className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
        <div className="px-4 py-3 bg-surface-container border-b border-outline/20">
          <h2 className="font-medium text-on-surface">Stock Movement Log</h2>
        </div>
        <Table>
          <TableHeader className="bg-surface-container/50">
            <TableRow>
              <TableHead>Date</TableHead><TableHead>Type</TableHead>
              <TableHead>Ingredient</TableHead><TableHead>Quantity</TableHead>
              <TableHead>Supplier</TableHead><TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map(({ movement, ingredient, supplier }) => (
              <TableRow key={movement.id} className="hover:bg-surface-container-low transition-colors">
                <TableCell className="text-sm text-on-surface-variant">{formatDateTime(movement.createdAt)}</TableCell>
                <TableCell>
                  <Badge className={movement.type === "IN"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-red-100 text-red-700 border-red-200"}>
                    {movement.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-on-surface">
                  {ingredient?.name || "—"}
                  <div className="text-xs text-on-surface-variant">{ingredient?.category}</div>
                </TableCell>
                <TableCell>{movement.quantity} {ingredient?.unit || ""}</TableCell>
                <TableCell>{supplier?.name || <span className="text-on-surface-variant/50">—</span>}</TableCell>
                <TableCell className="text-sm text-on-surface-variant">{movement.reason || "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleDelete(movement.id)} disabled={isPending}
                    className="border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-on-surface-variant">
                  No stock movements yet. Click <span className="font-medium text-primary">+ Stock In</span> to record your first purchase.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

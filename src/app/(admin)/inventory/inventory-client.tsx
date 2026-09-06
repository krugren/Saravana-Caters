"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { createIngredient, createSupplier, deleteIngredient, deleteSupplier } from "@/features/inventory/actions";
import { toast } from "sonner";

type Ingredient = { id: string; name: string; category: string; unit: string; minThreshold: number | null };
type Supplier = { id: string; name: string; phone: string | null; address: string | null; notes: string | null };

const ING_CATEGORIES = ["GRAIN", "VEGETABLE", "FRUIT", "DAIRY", "OIL", "SPICE", "PROTEIN", "OTHER"];
const UNITS = ["kg", "g", "L", "mL", "nos", "dozen", "bag"];

export default function InventoryClient({ ingredients, suppliers }: { ingredients: Ingredient[]; suppliers: Supplier[] }) {
  const router = useRouter();
  const [ingOpen, setIngOpen] = useState(false);
  const [supOpen, setSupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isPending, startTransition] = useTransition();
  const [ingForm, setIngForm] = useState({ name: "", category: "GRAIN", unit: "kg", minThreshold: 10 });
  const [supForm, setSupForm] = useState({ name: "", phone: "", address: "", notes: "" });

  function handleIngSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createIngredient({ ...ingForm, minThreshold: Number(ingForm.minThreshold) });
        setIngOpen(false); setIngForm({ name: "", category: "GRAIN", unit: "kg", minThreshold: 10 });
        router.refresh(); toast.success("Ingredient added");
      } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to add ingredient"); }
    });
  }

  function handleSupSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createSupplier(supForm);
        setSupOpen(false); setSupForm({ name: "", phone: "", address: "", notes: "" });
        router.refresh(); toast.success("Supplier added");
      } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to add supplier"); }
    });
  }

  function handleDeleteIng(id: string) {
    if (!confirm("Delete this ingredient?")) return;
    startTransition(async () => {
      try { await deleteIngredient(id); router.refresh(); toast.success("Ingredient deleted"); }
      catch (err) { toast.error(err instanceof Error ? err.message : "Failed to delete"); }
    });
  }

  function handleDeleteSup(id: string) {
    if (!confirm("Delete this supplier?")) return;
    startTransition(async () => {
      try { await deleteSupplier(id); router.refresh(); toast.success("Supplier deleted"); }
      catch (err) { toast.error(err instanceof Error ? err.message : "Failed to delete"); }
    });
  }

  const AddButton = activeTab === "ingredients" ? (
    <Dialog open={ingOpen} onOpenChange={setIngOpen}>
      <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" /> Add Ingredient</Button>} />
      <DialogContent showCloseButton={false} className="max-w-md bg-surface p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <DialogTitle className="text-xl font-display font-semibold text-on-surface">Add Ingredient</DialogTitle>
            <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
          </div>
          <DialogDescription className="text-sm text-on-surface-variant mb-5">Add a raw material to your inventory.</DialogDescription>
          <form onSubmit={handleIngSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Name *</label>
              <input value={ingForm.name} onChange={(e) => setIngForm((p) => ({ ...p, name: e.target.value }))} required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Category</label>
                <select value={ingForm.category} onChange={(e) => setIngForm((p) => ({ ...p, category: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {ING_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Unit</label>
                <select value={ingForm.unit} onChange={(e) => setIngForm((p) => ({ ...p, unit: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Min Stock</label>
                <input type="number" min={0} value={ingForm.minThreshold} onChange={(e) => setIngForm((p) => ({ ...p, minThreshold: Number(e.target.value) }))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <DialogClose render={<button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>} />
              <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                {isPending ? "Saving…" : "Add Ingredient"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={supOpen} onOpenChange={setSupOpen}>
      <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" /> Add Supplier</Button>} />
      <DialogContent showCloseButton={false} className="max-w-md bg-surface p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <DialogTitle className="text-xl font-display font-semibold text-on-surface">Add Supplier</DialogTitle>
            <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
          </div>
          <DialogDescription className="text-sm text-on-surface-variant mb-5">Add a new supplier to your directory.</DialogDescription>
          <form onSubmit={handleSupSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Supplier Name *</label>
              <input value={supForm.name} onChange={(e) => setSupForm((p) => ({ ...p, name: e.target.value }))} required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Phone</label>
                <input value={supForm.phone} onChange={(e) => setSupForm((p) => ({ ...p, phone: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Address</label>
                <input value={supForm.address} onChange={(e) => setSupForm((p) => ({ ...p, address: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Notes</label>
              <textarea value={supForm.notes} onChange={(e) => setSupForm((p) => ({ ...p, notes: e.target.value }))} rows={2}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <DialogClose render={<button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>} />
              <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                {isPending ? "Saving…" : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Inventory</h1>
          <p className="text-on-surface-variant">Manage ingredients, raw materials, and suppliers.</p>
        </div>
        {AddButton}
      </div>

      <Tabs defaultValue="ingredients" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-surface-container-low mb-4">
          <TabsTrigger value="ingredients">Ingredients ({ingredients.length})</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers ({suppliers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
          <Table>
            <TableHeader className="bg-surface-container">
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Category</TableHead>
                <TableHead>Unit</TableHead><TableHead>Min Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ing) => (
                <TableRow key={ing.id} className="hover:bg-surface-container-low transition-colors">
                  <TableCell className="font-medium text-on-surface">{ing.name}</TableCell>
                  <TableCell>{ing.category}</TableCell>
                  <TableCell>{ing.unit}</TableCell>
                  <TableCell>{ing.minThreshold}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleDeleteIng(ing.id)} disabled={isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {ingredients.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-on-surface-variant">No ingredients found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="suppliers" className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
          <Table>
            <TableHeader className="bg-surface-container">
              <TableRow>
                <TableHead>Supplier</TableHead><TableHead>Phone</TableHead>
                <TableHead>Address</TableHead><TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((sup) => (
                <TableRow key={sup.id} className="hover:bg-surface-container-low transition-colors">
                  <TableCell className="font-medium text-on-surface">{sup.name}</TableCell>
                  <TableCell>{sup.phone || "—"}</TableCell>
                  <TableCell>{sup.address || "—"}</TableCell>
                  <TableCell className="text-sm text-on-surface-variant max-w-[180px] truncate">{sup.notes || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleDeleteSup(sup.id)} disabled={isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {suppliers.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-on-surface-variant">No suppliers yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}

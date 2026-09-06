"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil } from "lucide-react";
import { createDish, updateDish, deleteDish, deleteServiceModel } from "@/features/menus/actions";
import { toast } from "sonner";

type Dish = {
  id: string;
  name: string;
  nameTamil: string | null;
  category: string;
  dietType: string;
  description: string | null;
  tags: unknown;
  isActive: boolean | null;
};
type ServiceModel = {
  id: string;
  displayName: string;
  pricingBasis: string;
  minGuests: number | null;
  maxGuests: number | null;
  isActive: boolean | null;
};

const DISH_CATEGORIES = ["BREAKFAST", "RICE", "GRAVIES", "STARTERS", "SWEETS", "BEVERAGES"];
const DIET_TYPES = ["VEG", "NON_VEG", "VEGAN", "JAIN"];

const EMPTY_FORM = { name: "", nameTamil: "", category: "BREAKFAST", dietType: "VEG", description: "", tags: "", isActive: true };

export default function MenusClient({ dishes, serviceModels }: { dishes: Dish[]; serviceModels: ServiceModel[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Add dialog ──────────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);

  // ── Edit dialog ─────────────────────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const parseTags = (raw: string) =>
    raw.split(",").map((t) => t.trim()).filter(Boolean);

  function openEdit(dish: Dish) {
    setEditingDish(dish);
    setEditForm({
      name: dish.name,
      nameTamil: dish.nameTamil ?? "",
      category: dish.category,
      dietType: dish.dietType,
      description: dish.description ?? "",
      tags: Array.isArray(dish.tags) ? (dish.tags as string[]).join(", ") : "",
      isActive: dish.isActive !== false,
    });
    setEditOpen(true);
  }

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createDish({
          name: addForm.name,
          nameTamil: addForm.nameTamil || undefined,
          category: addForm.category,
          dietType: addForm.dietType,
          description: addForm.description || undefined,
          tags: parseTags(addForm.tags),
          isActive: addForm.isActive,
        });
        setAddOpen(false);
        setAddForm(EMPTY_FORM);
        router.refresh();
        toast.success("Dish added — website will update shortly");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add dish");
      }
    });
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDish) return;
    startTransition(async () => {
      try {
        await updateDish(editingDish.id, {
          name: editForm.name,
          nameTamil: editForm.nameTamil || undefined,
          category: editForm.category,
          dietType: editForm.dietType,
          description: editForm.description || undefined,
          tags: parseTags(editForm.tags),
          isActive: editForm.isActive,
        });
        setEditOpen(false);
        setEditingDish(null);
        router.refresh();
        toast.success("Dish updated — website will update shortly");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update dish");
      }
    });
  }

  function handleDeleteDish(id: string) {
    if (!confirm("Delete this dish? It will be removed from the website too.")) return;
    startTransition(async () => {
      try {
        await deleteDish(id);
        router.refresh();
        toast.success("Dish deleted — website updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete dish");
      }
    });
  }

  function handleDeleteServiceModel(id: string) {
    if (!confirm("Delete this service model?")) return;
    startTransition(async () => {
      try {
        await deleteServiceModel(id);
        router.refresh();
        toast.success("Service model deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete service model");
      }
    });
  }

  // ── Shared form fields ──────────────────────────────────────────────────
  function DishForm({
    form,
    setForm,
    onSubmit,
    submitLabel,
  }: {
    form: typeof EMPTY_FORM;
    setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
  }) {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Dish Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        {/* Tamil name */}
        <div>
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Tamil Name (optional)</label>
          <input
            value={form.nameTamil}
            onChange={(e) => setForm((p) => ({ ...p, nameTamil: e.target.value }))}
            placeholder="e.g. இட்லி"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        {/* Category + Diet */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {DISH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Diet Type</label>
            <select
              value={form.dietType}
              onChange={(e) => setForm((p) => ({ ...p, dietType: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {DIET_TYPES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Description (shown on website)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            placeholder="Short description shown under the dish name on the menu page"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Tags (comma-separated)</label>
          <input
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="e.g. Signature Dish, Premium, Crowd Favourite"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        {/* Active toggle */}
        <div className="flex items-center gap-3 pt-1">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="isActive" className="text-sm text-on-surface">
            Show on website (active)
          </label>
        </div>
        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <DialogClose render={
            <button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">
              Cancel
            </button>
          } />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Saving…" : submitLabel}
          </button>
        </div>
      </form>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Menus &amp; Recipes</h1>
          <p className="text-on-surface-variant">Manage your service packages and dish catalogue. Changes reflect on the website instantly.</p>
        </div>

        {/* ── ADD DISH dialog ── */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Dish
            </Button>
          } />
          <DialogContent showCloseButton={false} className="max-w-md bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-xl font-display font-semibold text-on-surface">Add Dish</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">
                New dish will appear on the public menu page immediately.
              </DialogDescription>
              <DishForm form={addForm} setForm={setAddForm} onSubmit={handleAddSubmit} submitLabel="Add Dish" />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── EDIT DISH dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent showCloseButton={false} className="max-w-md bg-surface p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <DialogTitle className="text-xl font-display font-semibold text-on-surface">Edit Dish</DialogTitle>
              <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
            </div>
            <DialogDescription className="text-sm text-on-surface-variant mb-5">
              Changes will update the public website.
            </DialogDescription>
            <DishForm form={editForm} setForm={setEditForm} onSubmit={handleEditSubmit} submitLabel="Save Changes" />
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="dishes" className="w-full">
        <TabsList className="bg-surface-container-low mb-4">
          <TabsTrigger value="dishes">Dishes ({dishes.length})</TabsTrigger>
          <TabsTrigger value="service-models">Service Models ({serviceModels.length})</TabsTrigger>
        </TabsList>

        {/* ── DISHES tab ── */}
        <TabsContent value="dishes" className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
          <Table>
            <TableHeader className="bg-surface-container">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Diet</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.map((dish) => (
                <TableRow key={dish.id} className="hover:bg-surface-container-low transition-colors">
                  <TableCell className="font-medium text-on-surface">
                    <div>{dish.name}</div>
                    {dish.nameTamil && <div className="text-xs text-on-surface-variant font-tamil">{dish.nameTamil}</div>}
                  </TableCell>
                  <TableCell className="text-xs">{dish.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={dish.dietType === "VEG" ? "default" : "destructive"}
                      className={dish.dietType === "VEG"
                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                        : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"}
                    >
                      {dish.dietType}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="text-xs text-on-surface-variant truncate">{dish.description ?? "—"}</p>
                  </TableCell>
                  <TableCell>
                    {dish.isActive !== false
                      ? <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                      : <Badge variant="secondary">Hidden</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(dish)}
                        disabled={isPending}
                        className="border-outline/40 text-on-surface-variant hover:bg-surface-container"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDish(dish.id)}
                        disabled={isPending}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {dishes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-on-surface-variant">
                    No dishes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* ── SERVICE MODELS tab ── */}
        <TabsContent value="service-models" className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
          <Table>
            <TableHeader className="bg-surface-container">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Pricing Basis</TableHead>
                <TableHead>Guests Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceModels.map((model) => (
                <TableRow key={model.id} className="hover:bg-surface-container-low transition-colors">
                  <TableCell className="font-medium text-on-surface">{model.displayName}</TableCell>
                  <TableCell>{model.pricingBasis}</TableCell>
                  <TableCell>{model.minGuests} – {model.maxGuests}</TableCell>
                  <TableCell>
                    {model.isActive
                      ? <Badge className="bg-forest-green hover:bg-forest-green/90 text-white border-transparent">Active</Badge>
                      : <Badge variant="secondary">Inactive</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteServiceModel(model.id)}
                      disabled={isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}

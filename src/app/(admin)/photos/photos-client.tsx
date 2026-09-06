"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Upload, Link as LinkIcon, Star, EyeOff } from "lucide-react";
import { addGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/features/gallery/actions";
import { toast } from "sonner";

type GalleryImage = {
  id: string; url: string; alt: string; category: string;
  isFeatured: boolean | null; sortOrder: number; isActive: boolean | null; uploadedAt: string;
};

const CATEGORIES = ["General", "Weddings", "Corporate", "House Functions", "Food", "Sweets & Desserts", "Team"];
const EMPTY_FORM = { url: "", alt: "", category: "General", isFeatured: false, sortOrder: 0, isActive: true };

export default function PhotosClient({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [addMode, setAddMode] = useState<"upload" | "url">("upload");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filteredImages = filterCategory === "All" ? images : images.filter(i => i.category === filterCategory);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image files allowed"); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("File too large (max 8MB)"); return; }

    setUploading(true);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/gallery/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(p => ({ ...p, url: data.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  }

  function openEdit(img: GalleryImage) {
    setForm({ url: img.url, alt: img.alt, category: img.category, isFeatured: img.isFeatured ?? false, sortOrder: img.sortOrder, isActive: img.isActive !== false });
    setPreviewUrl(img.url);
    setEditingId(img.id);
    setEditOpen(true);
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url) { toast.error("Please upload an image or paste a URL"); return; }
    startTransition(async () => {
      try {
        await addGalleryImage(form);
        setAddOpen(false);
        setForm(EMPTY_FORM);
        setPreviewUrl("");
        router.refresh();
        toast.success("Photo added — website updated");
      } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    });
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    startTransition(async () => {
      try {
        await updateGalleryImage(editingId, { alt: form.alt, category: form.category, isFeatured: form.isFeatured, sortOrder: form.sortOrder, isActive: form.isActive });
        setEditOpen(false);
        router.refresh();
        toast.success("Photo updated — website updated");
      } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this photo from the gallery?")) return;
    startTransition(async () => {
      try {
        await deleteGalleryImage(id);
        router.refresh();
        toast.success("Photo deleted — website updated");
      } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    });
  }

  function FormFields({ isEdit = false }) {
    return (
      <div className="space-y-4">
        {/* Image source — upload or URL (only in add mode) */}
        {!isEdit && (
          <div>
            <div className="flex gap-2 mb-3">
              <button type="button" onClick={() => setAddMode("upload")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${addMode === "upload" ? "bg-primary text-white border-primary" : "border-outline/40 text-on-surface-variant"}`}>
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
              <button type="button" onClick={() => setAddMode("url")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${addMode === "url" ? "bg-primary text-white border-primary" : "border-outline/40 text-on-surface-variant"}`}>
                <LinkIcon className="w-3.5 h-3.5" /> Paste URL
              </button>
            </div>

            {addMode === "upload" ? (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="w-full h-28 border-2 border-dashed border-outline/40 rounded-xl flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-50">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">{uploading ? "Uploading…" : "Click to upload (max 8MB)"}</span>
                </button>
              </div>
            ) : (
              <div>
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Image URL *</label>
                <input value={form.url} onChange={e => { setForm(p => ({ ...p, url: e.target.value })); setPreviewUrl(e.target.value); }}
                  placeholder="https://..."
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mt-2 relative h-32 rounded-xl overflow-hidden bg-surface-container">
                <Image src={previewUrl} alt="Preview" fill unoptimized className="object-cover" />
              </div>
            )}
          </div>
        )}

        {/* Alt text */}
        <div>
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Description / Alt Text *</label>
          <input value={form.alt} onChange={e => setForm(p => ({ ...p, alt: e.target.value }))} required
            placeholder="e.g. Traditional banana leaf wedding feast for 500 guests"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4 accent-primary" />
            <label htmlFor="isFeatured" className="text-sm text-on-surface flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> Featured (homepage preview)</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActiveImg" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
            <label htmlFor="isActiveImg" className="text-sm text-on-surface">Active (show on site)</label>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <DialogClose render={<button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>} />
          <button type="submit" disabled={isPending || uploading} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
            {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Photo"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Photo Gallery</h1>
          <p className="text-on-surface-variant">Manage gallery images shown on the public website. Upload or add URL links.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={v => { setAddOpen(v); if (!v) { setForm(EMPTY_FORM); setPreviewUrl(""); } }}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" /> Add Photo</Button>} />
          <DialogContent showCloseButton={false} className="max-w-lg bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-xl font-display font-semibold text-on-surface">Add Photo</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">Upload a photo or paste an image URL.</DialogDescription>
              <form onSubmit={handleAddSubmit}><FormFields /></form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent showCloseButton={false} className="max-w-lg bg-surface p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <DialogTitle className="text-xl font-display font-semibold text-on-surface">Edit Photo</DialogTitle>
              <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg">&times;</button>} />
            </div>
            <DialogDescription className="text-sm text-on-surface-variant mb-5">Update description, category, or visibility.</DialogDescription>
            {/* Preview */}
            {previewUrl && <div className="mb-4 relative h-32 rounded-xl overflow-hidden bg-surface-container"><Image src={previewUrl} alt="Preview" fill unoptimized className="object-cover" /></div>}
            <form onSubmit={handleEditSubmit}><FormFields isEdit /></form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${filterCategory === cat ? "bg-primary text-white border-primary" : "border-outline/40 text-on-surface-variant hover:border-primary/50"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredImages.map(img => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-surface-container">
            <Image src={img.url} alt={img.alt} fill unoptimized className="object-cover" />

            {/* Overlay badges */}
            <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
              {img.isFeatured && <Badge className="bg-amber-500 text-white border-transparent text-[10px] px-1.5 py-0.5"><Star className="w-2.5 h-2.5 mr-0.5" />Featured</Badge>}
              {img.isActive === false && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5"><EyeOff className="w-2.5 h-2.5 mr-0.5" />Hidden</Badge>}
              <Badge className="bg-surface/80 text-on-surface border-transparent text-[10px] px-1.5 py-0.5">{img.category}</Badge>
            </div>

            {/* Action overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(img)} className="bg-white/90 border-0 text-gray-800 hover:bg-white h-8 w-8 p-0">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(img.id)} disabled={isPending} className="bg-red-500/90 border-0 text-white hover:bg-red-500 h-8 w-8 p-0">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Alt text */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-[10px] line-clamp-2">{img.alt}</p>
            </div>
          </div>
        ))}

        {filteredImages.length === 0 && (
          <div className="col-span-4 py-16 text-center text-on-surface-variant border border-dashed border-outline/30 rounded-xl">
            No photos in this category. Add one with the button above.
          </div>
        )}
      </div>

      <p className="text-xs text-on-surface-variant">
        {images.length} total photos · {images.filter(i => i.isActive).length} active · {images.filter(i => i.isFeatured).length} featured
      </p>
    </div>
  );
}

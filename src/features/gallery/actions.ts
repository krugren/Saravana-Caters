"use server";

import { db } from "@/db";
import { gallery_images } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth-guard";

/** Public: active images sorted by sortOrder */
export async function getPublicGallery() {
  return await db
    .select()
    .from(gallery_images)
    .where(eq(gallery_images.isActive, true))
    .orderBy(asc(gallery_images.sortOrder));
}

/** Admin: all images */
export async function getGalleryImages() {
  await requireAuth();
  return await db.select().from(gallery_images).orderBy(asc(gallery_images.sortOrder));
}

export async function addGalleryImage(data: {
  url: string;
  alt: string;
  category: string;
  isFeatured?: boolean;
  sortOrder?: number;
}) {
  const session = await requireRole("ADMIN", "OWNER");
  const id = generateId();
  await db.insert(gallery_images).values({
    id,
    url: data.url,
    alt: data.alt,
    category: data.category,
    isFeatured: data.isFeatured ?? false,
    sortOrder: data.sortOrder ?? 999,
    isActive: true,
    uploadedAt: new Date().toISOString(),
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "GALLERY", entityId: id, after: data });
  revalidatePath("/photos");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateGalleryImage(
  id: string,
  data: { alt?: string; category?: string; isFeatured?: boolean; sortOrder?: number; isActive?: boolean }
) {
  const session = await requireRole("ADMIN", "OWNER");
  await db.update(gallery_images).set(data).where(eq(gallery_images.id, id));
  await logAudit({ userId: session.user.id, action: "UPDATE", module: "GALLERY", entityId: id, after: data });
  revalidatePath("/photos");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  // Get url before deleting so we can clean up local files
  const rows = await db.select().from(gallery_images).where(eq(gallery_images.id, id));
  await db.delete(gallery_images).where(eq(gallery_images.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "GALLERY", entityId: id });
  revalidatePath("/photos");
  revalidatePath("/gallery");
  revalidatePath("/");
  // If the image was uploaded locally, return its path so the API can clean it up
  const localPath = rows[0]?.url?.startsWith("/gallery/") ? rows[0].url : null;
  return { success: true, localPath };
}

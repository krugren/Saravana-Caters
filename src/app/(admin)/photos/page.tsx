import { getGalleryImages } from "@/features/gallery/actions";
import PhotosClient from "./photos-client";

export default async function PhotosPage() {
  const images = await getGalleryImages();
  return <PhotosClient images={images} />;
}

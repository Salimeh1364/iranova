import { GalleryCanvas } from "@/components/gallery/GalleryCanvas";
import { GalleryChrome } from "@/components/ui/GalleryOverlay";

export default function Home() {
  return (
    <main className="gallery-page" aria-labelledby="gallery-title">
      <GalleryChrome>
        <GalleryCanvas />
      </GalleryChrome>
    </main>
  );
}

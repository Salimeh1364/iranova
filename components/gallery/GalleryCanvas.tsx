"use client";

import dynamic from "next/dynamic";
import { GalleryStatus } from "@/components/gallery/GalleryStatus";

// The scene uses WebGL, which does not exist during server rendering.
const GalleryView = dynamic(() => import("@/components/gallery/GalleryView"), {
  ssr: false,
  loading: () => <GalleryStatus kind="loading" />,
});

export function GalleryCanvas() {
  return <GalleryView />;
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    lang: "es",
    name: "Gestión del gimnasio",
    short_name: "Gimnasio",
    start_url: "/planes",
    scope: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/gym-192.png", sizes: "192x192", type: "image/png" },
      { src: "/gym-512.png", sizes: "512x512", type: "image/png" },
      { src: "/gym-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

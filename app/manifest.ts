import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ziq - AI Research Assistant",
    short_name: "Ziq Research",
    description: "Your AI research companion that delivers deep insights and verified information for all your search needs",
    start_url: "/",
    display: "standalone",
    categories: ["search", "ai", "productivity"],
    theme_color: "#171717",
    background_color: "#171717",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png"
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/logo.png",
        sizes: "180x180",
        type: "image/png"
      }
    ],
    screenshots: [
      {
        src: "/opengraph-image.png",
        type: "image/png",
        sizes: "1200x630",
      }
    ]
  }
}
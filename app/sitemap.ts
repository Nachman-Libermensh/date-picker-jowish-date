import type { MetadataRoute } from "next"

import { getCanonicalRoute } from "@/lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: getCanonicalRoute("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getCanonicalRoute("/instructions"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getCanonicalRoute("/full-calendar"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ]
}

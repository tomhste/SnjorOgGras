import type { MetadataRoute } from "next";
import { business } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: business.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

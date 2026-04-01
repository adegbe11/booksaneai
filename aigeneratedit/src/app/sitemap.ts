import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aigeneratedit.com";
  const now  = new Date("2026-03-31");

  return [
    { url: base,                       lastModified: now, changeFrequency: "weekly",  priority: 1.00 },
    { url: `${base}/detect/audio`,     lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/detect/video`,     lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/detect/image`,     lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/detect/text`,      lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/detect/url`,       lastModified: now, changeFrequency: "weekly",  priority: 0.90 },
    { url: `${base}/badge`,            lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${base}/blog`,             lastModified: now, changeFrequency: "daily",   priority: 0.85 },
    { url: `${base}/api`,              lastModified: now, changeFrequency: "monthly", priority: 0.70 },
    { url: `${base}/about`,            lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/contact`,          lastModified: now, changeFrequency: "yearly",  priority: 0.55 },
    { url: `${base}/privacy`,          lastModified: now, changeFrequency: "yearly",  priority: 0.25 },
    { url: `${base}/terms`,            lastModified: now, changeFrequency: "yearly",  priority: 0.25 },
  ];
}

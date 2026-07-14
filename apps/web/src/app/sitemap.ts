import { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";

const BASE_URL = "https://toolnest.app";

// A realistic "last built" date — sitemap is regenerated at build time.
// Next.js will stamp this with the actual build date in production.
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  // Only include pages that render real content (skip coming-soon stubs).
  const functionalTools = TOOLS.filter((t) => t.isFunctional);

  const toolPages: MetadataRoute.Sitemap = functionalTools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly",
    priority: tool.isPopular ? 0.9 : 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORIES).map(
    (cat) => ({
      url: `${BASE_URL}/category/${cat}`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [
    {
      url: BASE_URL,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/all-tools`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // /category index page — lower than individual category pages
    {
      url: `${BASE_URL}/category`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...categoryPages,
    ...toolPages,
    {
      url: `${BASE_URL}/about`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // /search is noindex — intentionally excluded from sitemap
  ];
}

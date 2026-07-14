import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api/ doesn't exist yet but block it defensively.
      // /search is intentionally noindex via its own metadata but CAN be crawled
      // so bots can discover it; the noindex directive handles de-indexing.
      disallow: ["/api/"],
    },
    sitemap: "https://toolnest.app/sitemap.xml",
  };
}

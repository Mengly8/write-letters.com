import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/my-letters"],
    },
    sitemap: "https://write-letters.com/sitemap.xml",
  };
}

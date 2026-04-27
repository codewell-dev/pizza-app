import { MetadataRoute } from "next";

const BASE_URL = "https://pizza-house-client-ochre.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/order/", "/my-orders/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

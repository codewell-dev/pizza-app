import { MetadataRoute } from "next";
import { getPizzas } from "@/lib/api";

const BASE_URL = "https://pizza-house-client-ochre.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pizzas = await getPizzas().catch(() => []);

  const productUrls = pizzas.flatMap((pizza) =>
    pizza.products.map((product) => ({
      url: `${BASE_URL}/${product._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...productUrls,
  ];
}

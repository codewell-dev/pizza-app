import { Metadata } from "next";
import { Container, Grid } from "@mui/material";
import { getCategoryById } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import PizzaCard from "@/app/entities/pizza/pizza-card";
import CardProduct from "@/app/entities/components/card-product";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * якщо є групи — рендеримо PizzaCard
 * якщо нема — рендеримо CardProduct
 */
function hasGroups(response: any) {
  return (
    Array.isArray(response?.category_group_products) &&
    response.category_group_products.length > 0
  );
}

/**
 * нормалізація grouped структури
 */
function mapGroups(response: any) {
  return (response?.category_group_products ?? []).map((group: any) => ({
    _id: group._id,
    title: group.title,
    products: group.products ?? [],
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("category");

  return {
    title: `${t("metaTitle")}: ${id}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;

  const [response, t] = await Promise.all([
    getCategoryById(id),
    getTranslations("category"),
  ]);

  const isGrouped = hasGroups(response);

  const groups = isGrouped ? mapGroups(response) : [];
  const products = response?.category_products ?? [];

  const isEmpty = isGrouped ? groups.length === 0 : products.length === 0;

  if (isEmpty) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <p>{t("empty")}</p>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Grid container spacing={3} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        {isGrouped
          ? groups.map((pizza: any) => (
              <Grid
                key={pizza._id}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                sx={{ display: "flex" }}
              >
                <PizzaCard title={pizza.title} products={pizza.products} />
              </Grid>
            ))
          : products.map((product: any) => (
              <Grid
                key={product._id}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                sx={{ display: "flex" }}
              >
                <CardProduct product={product} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
}

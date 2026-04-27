import { Metadata } from "next";
import { Container, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import PriceBox from "../entities/productId/price-box";
import ModifiersCheckboxList from "../entities/productId/modifiers-checkbox-list";
import RelatedProducts from "../entities/productId/related-products";
import ModifiersMultiple from "../entities/productId/modifiers-multiple";
import ModifiersList from "../entities/productId/modifiers-list";
import Breadcrumbs from "../entities/breadcrumbs/breadcrumbs";
import ProductVariantSwitcher from "../entities/productId/product-variant-switcher";
import { getPizzaById, getPizzas } from "@/lib/api";
import { GroupModifier, Product } from "@/types/product";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ pizzaId: string }>;
}

export async function generateStaticParams() {
  try {
    const pizzas = await getPizzas();
    return pizzas.flatMap((pizza) =>
      pizza.products.map((p) => ({ pizzaId: p._id.toString() }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { pizzaId } = await params;
    const product = await getPizzaById(pizzaId);
    const imageUrl = `https://pizzahouse.ua${product.image.large}`;
    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [
          { url: imageUrl, width: 800, height: 800, alt: product.title },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "Продукт не знайдено" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { pizzaId } = await params;
  // Паралельно отримуємо продукт, всі піци (для варіантів розміру) і переклади
  const [product, pizzas, t, tb] = await Promise.all([
    getPizzaById(pizzaId),
    getPizzas(),
    getTranslations("product"),
    getTranslations("breadcrumbs"),
  ]);

  if (!product) notFound();

  // Знаходимо групу варіантів цієї піци (різні розміри одного продукту)
  const pizzaGroup = pizzas.find((p) =>
    p.products.some((prod) => prod._id === pizzaId)
  );
  const variants: Product[] = pizzaGroup?.products ?? [];

  // Схожі продукти — перші 3 з well_together_products
  const relatedProducts = (pizzas ?? pizzas).slice(0, 3);

  const sortedModifiers = [...(product.group_modifiers ?? [])].sort((a, b) => {
    if (a.type === "select_one" && b.type !== "select_one") return -1;
    if (a.type !== "select_one" && b.type === "select_one") return 1;
    return 0;
  });

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}
    >
      <Breadcrumbs
        crumbs={[
          { label: tb("home"), href: "/" },
          { label: tb("pizza"), href: "/" },
          { label: product.title },
        ]}
      />

      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        alignItems="flex-start"
        justifyContent="center"
        sx={{ mt: 1 }}
      >
        {/* Зображення */}
        <Grid size={{ xs: 12, md: 6 }} className="flex justify-center">
          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={`https://pizzahouse.ua${product.image.large}`}
              alt={product.title}
              width={400}
              height={400}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
              priority
            />
          </Box>
        </Grid>

        {/* Інфо */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ maxWidth: "500px" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontSize: { xs: "1.75rem", sm: "2.2rem", md: "2.5rem" } }}
            gutterBottom
          >
            {product.title}
          </Typography>

          {/* Варіанти розміру — як на головному меню (850г / 1350г) */}
          <ProductVariantSwitcher
            currentProductId={pizzaId}
            variants={variants}
          />

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {product.weight} {t("weight")}
          </Typography>

          <Typography
            variant="body1"
            gutterBottom
            sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}
          >
            {product.description}
          </Typography>

          <Box sx={{ my: { xs: 2, md: 4 } }}>
            <PriceBox product={product} />
          </Box>

          {sortedModifiers.length > 0 && (
            <Box className="mt-6">
              <Typography variant="h5" gutterBottom>
                {t("addons")}
              </Typography>
              <ModifiersList />
              {sortedModifiers.map((mod: GroupModifier) =>
                mod.type === "select_one" ? (
                  <ModifiersCheckboxList
                    key={mod._id}
                    title={mod.title}
                    modifiers={mod.modifiers}
                    groupId={mod._id}
                  />
                ) : mod.type === "select_many" || mod.type === "multiple" ? (
                  <ModifiersMultiple key={mod._id} group={mod} />
                ) : null
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

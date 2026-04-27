import { Suspense } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Categories from "./widgets/categories";
import Carousel from "./widgets/carousel";
import PizzaCard from "./entities/pizza/pizza-card";
import PizzaCardSkeleton from "./entities/pizza/pizza-card-skeleton";
import { getPizzas, getCategories } from "@/lib/api";
import { Pizza } from "@/types/product";
import MobileOrderBar from "./widgets/mobile-order-bar";
import { getTranslations } from "next-intl/server";

async function getData() {
  const [pizzas, categories] = await Promise.all([
    getPizzas(),
    getCategories(),
  ]);
  return { pizzas, categories };
}

export default async function HomePage() {
  const { pizzas, categories } = await getData();
  const t = await getTranslations("home");

  const visiblePizzas = (pizzas ?? []).filter(
    (pizza: Pizza) => pizza?.products?.length > 0
  );

  return (
    <>
      {/* ── Hero carousel ───────────────────────────────────── */}
      <Box sx={{ py: { xs: 2, md: 3 } }}>
        <Carousel />
      </Box>

      {/* ── Mobile categories (scrollable) ──────────────────── */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
        <Box
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Categories categories={categories} />
        </Box>
      </Box>

      {/* ── Product grid ────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ pb: { xs: 10, md: 6 } }}>
        {/* Section header */}
        <Box sx={{ mb: { xs: 2.5, md: 3.5 } }}>
          <Typography
            className="section-eyebrow"
            component="p"
            sx={{ display: "block" }}
          >
            {t("eyebrow")}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#1A1A18",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {t("heading")}
          </Typography>
        </Box>

        {/* Grid */}
        <Suspense
          fallback={
            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Grid
                  key={i}
                  size={{ xs: 6, sm: 6, md: 4, lg: 3 }}
                  sx={{ display: "flex" }}
                >
                  <PizzaCardSkeleton />
                </Grid>
              ))}
            </Grid>
          }
        >
          <Grid
            container
            spacing={{ xs: 2, md: 2.5 }}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
          >
            {visiblePizzas.map((pizza: Pizza, index: number) => (
              <Grid
                key={pizza._id}
                size={{ xs: 6, sm: 6, md: 4, lg: 3 }}
                sx={{
                  display: "flex",
                  // Staggered fade-in animation
                  animation: "fadeIn 0.4s ease both",
                  animationDelay: `${Math.min(index * 0.04, 0.5)}s`,
                }}
              >
                <PizzaCard title={pizza.title} products={pizza.products} />
              </Grid>
            ))}
          </Grid>
        </Suspense>
      </Container>

      {/* Mobile sticky cart bar — shows when cart has items */}
      <MobileOrderBar />
    </>
  );
}
